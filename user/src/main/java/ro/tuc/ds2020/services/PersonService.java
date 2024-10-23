package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public PersonService(PersonRepository personRepository,RestTemplate restTemplate) {
        this.personRepository = personRepository;
        this.restTemplate=restTemplate;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(Integer id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public Integer insert(PersonDetailsDTO personDTO) {
        // Convert DTO to entity
        Person person = PersonBuilder.toEntity(personDTO);
        person = personRepository.save(person);

        try {
            // URL for the external microservice
            String microserviceUrl = "http://localhost:8080/device/person/";

            // Get the client ID from the saved person entity
            Integer clientId = person.getId();

            // Append the client ID to the URL
            microserviceUrl = microserviceUrl + clientId;

            // Use RestTemplate to make the POST request
            ResponseEntity<String> response = restTemplate.postForEntity(microserviceUrl, clientId, String.class);

            // Log the response from the external microservice
            LOGGER.debug("Response from microservice: {}", response.getBody());
        } catch (Exception e) {
            LOGGER.error("Error calling microservice: {}", e.getMessage());
            // Handle error appropriately (e.g., rethrow, log, etc.)
        }

        // Log successful insertion and return the ID of the inserted person
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }
}
