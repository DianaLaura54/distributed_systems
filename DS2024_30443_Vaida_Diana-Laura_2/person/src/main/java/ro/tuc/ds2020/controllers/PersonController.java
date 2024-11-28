package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;

import java.util.List;

import static org.hibernate.tool.schema.SchemaToolingLogging.LOGGER;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    // Login method
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody PersonDetailsDTO personDTO) {
        PersonDTO person = personService.authenticate(personDTO.getName(), personDTO.getPassword());
        if (person != null) {
            return ResponseEntity.ok(person);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }



    @GetMapping()
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = personService.findPersons();
        for (PersonDTO dto : dtos) {
            Link personLink = linkTo(methodOn(PersonController.class)
                    .getPerson(dto.getId())).withRel("personDetails");
            dto.add(personLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @PostMapping()
    public ResponseEntity<Integer> insertProsumer(@Valid @RequestBody PersonDetailsDTO personDTO) {

        if (personService.isUsernameTaken(personDTO.getName())) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }


        Integer personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDetailsDTO> getPerson(@PathVariable("id") Integer personId) {
        PersonDetailsDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }



    @DeleteMapping(value="/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable("id") Integer personId) {
        personService.deletePersonById(personId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(value="/{id}")
    public ResponseEntity<PersonDetailsDTO> updatePerson(@PathVariable("id") Integer personId, @Valid @RequestBody PersonDetailsDTO personDTO) {
        PersonDetailsDTO updatedPerson = personService.updatePerson(personId, personDTO);
        return new ResponseEntity<>(updatedPerson, HttpStatus.OK);
    }

}