package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Time;
import java.util.Date;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Entity
@Table(name = "hourly_energy_consumption")
public class HourlyEnergyConsumption implements Serializable {

    // Define primary key
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer Id;


    // Device ID (foreign key)
    @Column(name = "device_id", nullable = false)
    private int deviceId;

    // Hour (representing the hour of consumption, usually in a long format)
    @Column(name = "hour", nullable = false)
    private long hour;

    // Energy consumption (the total energy consumed during the hour)
    @Column(name = "energy_consumption", nullable = false)
    private Double energyConsumption;

    // Default constructor
    public HourlyEnergyConsumption() {
    }

    // Constructor with parameters
    public HourlyEnergyConsumption(int deviceId,long hour, Double energyConsumption) {
        this.deviceId = deviceId;
        this.hour = hour;
        this.energyConsumption = energyConsumption;
    }

    // Getters and setters

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }


    public int getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public long getHour() {
        return hour;
    }

    public void setHour(long hour) {
        this.hour = hour;
    }

    public Double getEnergyConsumption() {
        return energyConsumption;
    }

    public void setEnergyConsumption(Double energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    @Override
    public String toString() {
        return "HourlyEnergyConsumption{" +
                "id=" + id +
                ", deviceId='" + deviceId + '\'' +
                ", hour=" + hour +
                ", energyConsumption=" + energyConsumption +
                '}';
    }
}
