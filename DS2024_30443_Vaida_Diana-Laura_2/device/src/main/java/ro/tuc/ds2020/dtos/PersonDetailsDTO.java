package ro.tuc.ds2020.dtos;

import javax.validation.constraints.NotNull;
import java.util.Objects;

public class PersonDetailsDTO {

    private Integer Id;


    public PersonDetailsDTO() {
    }


    public PersonDetailsDTO(Integer Id) {
        this.Id = Id;

    }

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        this.Id=Id;
    }

}