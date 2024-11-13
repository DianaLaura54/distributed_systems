/*
package ro.tuc.ds2020.services;


import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;

import static org.springframework.test.util.AssertionErrors.assertEquals;

import java.util.List;
import java.util.UUID;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete.sql")
public class DeviceServiceIntegrationTests extends Ds2020TestConfig {

    @Autowired
    DeviceService DeviceService;

    @Test
    public void testGetCorrect() {
        List<DeviceDTO> DeviceDTOList = DeviceService.findDevices();
        assertEquals("Test Insert Device", 1, DeviceDTOList.size());
    }

    @Test
    public void testInsertCorrectWithGetById() {
        DeviceDetailsDTO p = new DeviceDetailsDTO("John", "Somewhere Else street", 22);
        UUID insertedID = DeviceService.insert(p);

        DeviceDetailsDTO insertedDevice = new DeviceDetailsDTO(insertedID, p.getName(),p.getAddress(), p.getAge());
        DeviceDetailsDTO fetchedDevice = DeviceService.findDeviceById(insertedID);

        assertEquals("Test Inserted Device", insertedDevice, fetchedDevice);
    }

    @Test
    public void testInsertCorrectWithGetAll() {
        DeviceDetailsDTO p = new DeviceDetailsDTO("John", "Somewhere Else street", 22);
        DeviceService.insert(p);

        List<DeviceDTO> DeviceDTOList = DeviceService.findDevices();
        assertEquals("Test Inserted Devices", 2, DeviceDTOList.size());
    }
}
 */
