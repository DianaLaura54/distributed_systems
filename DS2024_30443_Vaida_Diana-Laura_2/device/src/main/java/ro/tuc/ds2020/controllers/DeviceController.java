package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;
import ro.tuc.ds2020.services.DeviceService;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {

    private final DeviceService DeviceService;
    private final PersonService PersonService;

    @Autowired
    public DeviceController(DeviceService DeviceService,PersonService PersonService) {
        this.DeviceService = DeviceService;
        this.PersonService=PersonService;
    }


    @GetMapping()
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        List<DeviceDTO> dtos = DeviceService.findDevices();

        for (DeviceDTO dto : dtos) {

            Link DeviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("DeviceDetails");
            dto.add(DeviceLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Integer> insertProsumer(@Valid @RequestBody DeviceDetailsDTO deviceDTO) {

        Integer deviceID = DeviceService.insert(deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity<DeviceDetailsDTO> getDevice(@PathVariable("id") Integer DeviceId) {
        DeviceDetailsDTO dto = DeviceService.findDeviceById(DeviceId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
    @GetMapping(value = "/person/{ClientId}")
    public ResponseEntity<List<DeviceDetailsDTO>> getDevice2(@PathVariable("ClientId") Integer ClientId) {
        List<DeviceDetailsDTO> dtos = DeviceService.linkPersonToDevice(ClientId);
        if (dtos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content if no devices found
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK); // 200 OK with the list of device details
    }

    @GetMapping("/person")
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = PersonService.findPersons();

        for (PersonDTO dto : dtos) {

            Link DeviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("DeviceDetails");
            dto.add(DeviceLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }



    @DeleteMapping(value="/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable("id") Integer DeviceId) {
        DeviceService.deleteDeviceById(DeviceId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping(value="/{id}")
    public ResponseEntity<DeviceDetailsDTO> updateDevice(@PathVariable("id") Integer DeviceId, @Valid @RequestBody DeviceDetailsDTO DeviceDTO) {

        DeviceDetailsDTO updatedDevice = DeviceService.updateDevice(DeviceId, DeviceDTO);
        return new ResponseEntity<>(updatedDevice, HttpStatus.OK);
    }

    //for mapping
    @PostMapping("/person/insert/{clientId}/{deviceId}")
    public ResponseEntity<String> insertPersonWithClientIdAndDeviceId(@PathVariable("clientId") Integer clientId,
                                                                      @PathVariable("deviceId") Integer deviceId) {
        try {

            DeviceService.insertPersonWithClientId(clientId, deviceId);

            return ResponseEntity.ok("Person with Client ID " + clientId + " linked to Device ID " + deviceId + " successfully.");
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: " + e.getMessage());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to link Person to Device due to an unexpected error.");
        }
    }
    @PutMapping(value="/person/update/{clientId}/{deviceId}")
    public ResponseEntity<String> updatePersonWithClientIdAndDeviceId(@PathVariable("clientId") Integer clientId,
                                                                      @PathVariable("deviceId") Integer deviceId) {
        try {
            DeviceService.updatePersonWithClientId(clientId, deviceId);

            return ResponseEntity.ok("Person with Client ID " + clientId + " updated to Device ID " + deviceId + " successfully.");
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: " + e.getMessage());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to link Person to Device due to an unexpected error.");
        }

    }
    @DeleteMapping(value="person/delete/{clientId}")
    public ResponseEntity<Void> deleteDevices(@PathVariable("clientId") Integer clientId) {
        DeviceService.deleteDevicesByClientId(clientId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    //add person
    @PostMapping("/{clientId}")
    public ResponseEntity<Void> insert(@PathVariable("clientId") Integer clientId) {
        PersonService.addPerson(clientId);
        System.out.println(clientId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
