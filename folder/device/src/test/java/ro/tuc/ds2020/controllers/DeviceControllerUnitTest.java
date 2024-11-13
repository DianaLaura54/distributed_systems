/*
package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.services.DeviceService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class DeviceControllerUnitTest extends Ds2020TestConfig {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DeviceService service;

    @Test
    public void insertDeviceTest() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        DeviceDetailsDTO DeviceDTO = new DeviceDetailsDTO("John", "Somewhere Else street", 22);

        mockMvc.perform(post("/Device")
                .content(objectMapper.writeValueAsString(DeviceDTO))
                .contentType("application/json"))
                .andExpect(status().isCreated());
    }

    @Test
    public void insertDeviceTestFailsDueToAge() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        DeviceDetailsDTO DeviceDTO = new DeviceDetailsDTO("John", "Somewhere Else street", 17);

        mockMvc.perform(post("/Device")
                .content(objectMapper.writeValueAsString(DeviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void insertDeviceTestFailsDueToNull() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        DeviceDetailsDTO DeviceDTO = new DeviceDetailsDTO("John", null, 17);

        mockMvc.perform(post("/Device")
                .content(objectMapper.writeValueAsString(DeviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }
}*/