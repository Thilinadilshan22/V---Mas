package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguids.ems_backend.enums.AccountStatus;
import net.javaguids.ems_backend.enums.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String userName;
    private String email;
    private Role role;
    private AccountStatus accountStatus;
    private String profilePicture;
}
