package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.entities.HourlyEnergyConsumption;
import ro.tuc.ds2020.repositories.HourlyEnergyConsumptionRepository;

import java.sql.Time;


@Service
public class EnergyService {

    @Autowired
    private HourlyEnergyConsumptionRepository repository;

    // Method to save hourly energy consumption data
    public void saveHourlyEnergyConsumption(int deviceId, long hour, Double energyConsumption) {
        HourlyEnergyConsumption hourlyData = new HourlyEnergyConsumption(deviceId, hour, energyConsumption);
        repository.save(hourlyData);  // This saves the entity to the database
    }
}
