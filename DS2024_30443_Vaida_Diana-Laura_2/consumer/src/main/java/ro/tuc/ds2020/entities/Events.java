package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Time;
import java.util.Date;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Entity
@Table(name = "events")

public class Events implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer Id;


    // Device ID (foreign key)
    @Column(name = "device_id", nullable = false)
    private int deviceId;
    @Column(name = "event", nullable = false)
    private String event; // Description of the event
    @Column(name = "hourly", nullable = false)
    private int hourly; // Hourly consumption value

    // Default constructor
    public Events() {
    }

    // Parameterized constructor
    public Events(int deviceId, String event, int hourly) {
        this.deviceId = deviceId;
        this.event = event;
        this.hourly = hourly;
    }

    // Getters and setters
    public int getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public int getHourly() {
        return hourly;
    }

    public void setHourly(int hourly) {
        this.hourly = hourly;
    }

    // ToString method for easy debugging
    @Override
    public String toString() {
        return "Events{" +
                "deviceId=" + deviceId +
                ", event='" + event + '\'' +
                ", hourlyConsumption=" + hourly +
                '}';
    }
}
