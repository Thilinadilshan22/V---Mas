package net.javaguids.ems_backend.service.impl;

import net.javaguids.ems_backend.dto.AuthResponse;
import net.javaguids.ems_backend.dto.LoginRequest;
import net.javaguids.ems_backend.dto.RegisterRequest;
import net.javaguids.ems_backend.dto.UserDto;
import net.javaguids.ems_backend.entity.User;
import net.javaguids.ems_backend.enums.AccountStatus;
import net.javaguids.ems_backend.exception.ResourceNotFoundException;
import net.javaguids.ems_backend.repository.UserRepository;
import net.javaguids.ems_backend.security.JwtUtil;
import net.javaguids.ems_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setProfilePicture(request.getProfilePicture());

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUserName(), savedUser.getRole().name());

        return new AuthResponse(token, mapToDto(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPassword()));

        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getUserName(), user.getRole().name());

        return new AuthResponse(token, mapToDto(user));
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        Long requiredId = Objects.requireNonNull(id);
        User user = userRepository.findById(requiredId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public UserDto createUser(RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setProfilePicture(request.getProfilePicture());

        User savedUser = userRepository.save(Objects.requireNonNull(user));
        return mapToDto(savedUser);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        Long requiredId = Objects.requireNonNull(id);
        User user = userRepository.findById(requiredId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setAccountStatus(userDto.getAccountStatus());
        user.setProfilePicture(userDto.getProfilePicture());

        User updatedUser = userRepository.save(Objects.requireNonNull(user));
        return mapToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        Long requiredId = Objects.requireNonNull(id);
        User user = userRepository.findById(requiredId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(Objects.requireNonNull(user));
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus(),
                user.getProfilePicture());
    }
}
