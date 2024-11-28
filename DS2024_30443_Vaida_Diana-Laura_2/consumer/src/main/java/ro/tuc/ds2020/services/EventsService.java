package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.entities.Events;

import ro.tuc.ds2020.repositories.EventsRepository;

import java.sql.Time;

@Service
public class EventsService {

    @Autowired
    private EventsRepository repository;

    // Method to save hourly energy consumption data
    public void saveHourlyEnergyConsumption(int deviceId, String event, int hourly) {
        Events hourlyData = new Events(deviceId,event, hourly);
        repository.save(hourlyData);  // This saves the entity to the database
    }
}
