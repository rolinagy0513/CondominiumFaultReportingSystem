package org.example.condominiumfaultreportingsystem.excel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.UserDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.building.BuildingRepository;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.exception.ApartmentNotFoundException;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.report.ReportRepository;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BulkUserRegistrationService {

    private final UserRepository userRepository;
    private final BuildingRepository buildingRepository;
    private final ApartmentRepository apartmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExcelParserService excelParserService;
    private final GroupService groupService;
    private final CacheService cacheService;
    private final ReportRepository reportRepository;

    @Transactional
    public ExcelUploadResultDTO processExcelUpload(MultipartFile file) throws IOException {

        List<ExcelUploadDTO> uploadData = excelParserService.parseExcelFile(file);

        List<UserDTO> createdUsers = new ArrayList<>();
        List<ExcelUploadErrorDTO> errors = new ArrayList<>();

        int successCount = 0;
        int failCount = 0;

        for (ExcelUploadDTO data : uploadData) {
            try {
                ValidationResult validation = validateUploadData(data);

                if (!validation.isValid()) {
                    errors.add(ExcelUploadErrorDTO.builder()
                            .rowNumber(data.getRowNumber())
                            .email(data.getEmail())
                            .errorMessage(validation.getErrorMessage())
                            .errorType(validation.getErrorType())
                            .build());
                    failCount++;
                    continue;
                }

                UserRegistrationResult userData = registerUser(data);
                assignUserToApartment(userData.getUser(), data);

                log.info("THIS IS THE NEEDED LOG");
                log.info("Generated password for {}: {}", userData.getUser().getEmail(), userData.getPlainPassword());
                log.info("END OF THE NEEDED LOG");

                createdUsers.add(mapToUserDTO(userData.getUser()));
                successCount++;

            } catch (Exception e) {
                log.error("Failed to process row {}: {}", data.getRowNumber(), e.getMessage());
                errors.add(ExcelUploadErrorDTO.builder()
                        .rowNumber(data.getRowNumber())
                        .email(data.getEmail())
                        .errorMessage(e.getMessage())
                        .errorType(ErrorType.USER_CREATION_FAILED)
                        .build());
                failCount++;
            }
        }

        return ExcelUploadResultDTO.builder()
                .totalRows(uploadData.size())
                .successfulRegistrations(successCount)
                .failedRegistrations(failCount)
                .errors(errors)
                .createdUsers(createdUsers)
                .build();
    }

    private ValidationResult validateUploadData(ExcelUploadDTO data) {

        if (data.getEmail() == null || data.getEmail().isBlank()) {
            return ValidationResult.invalid("Email is required", ErrorType.INVALID_DATA);
        }

        if (data.getFirstname() == null || data.getFirstname().isBlank()) {
            return ValidationResult.invalid("First name is required", ErrorType.INVALID_DATA);
        }

        if (userRepository.existsByEmail((data.getEmail()))) {
            return ValidationResult.invalid(
                    "User with email " + data.getEmail() + " already exists",
                    ErrorType.DUPLICATE_EMAIL
            );
        }

        if (!isValidEmail(data.getEmail())) {
            return ValidationResult.invalid("Invalid email format", ErrorType.INVALID_DATA);
        }

        if (data.getBuildingNumber() != null) {
            Building building = buildingRepository
                    .findByBuildingNumber(data.getBuildingNumber())
                    .orElse(null);

            if (building == null) {
                return ValidationResult.invalid(
                        "Building number " + data.getBuildingNumber() + " not found",
                        ErrorType.BUILDING_NOT_FOUND
                );
            }
        }

        if (data.getBuildingNumber() != null && data.getApartmentNumber() != null && data.getFloor() != null) {
            Optional<Apartment> apartmentOpt = apartmentRepository
                    .findByBuildingNumberAndFloorAndApartmentNumber(
                            data.getBuildingNumber(),
                            data.getFloor(),
                            data.getApartmentNumber()
                    );

            if (apartmentOpt.isEmpty()) {
                return ValidationResult.invalid(
                        String.format("Apartment %d on floor %d in building %d not found",
                                data.getApartmentNumber(), data.getFloor(), data.getBuildingNumber()),
                        ErrorType.APARTMENT_NOT_FOUND
                );
            }

            Apartment apartment = apartmentOpt.get();

            if (apartment.getOwner() != null) {
                return ValidationResult.invalid(
                        String.format("Apartment %d on floor %d is already occupied by %s",
                                data.getApartmentNumber(), data.getFloor(),
                                apartment.getOwner().getEmail()),
                        ErrorType.APARTMENT_ALREADY_OCCUPIED
                );
            }

            if (apartment.getStatus() != ApartmentStatus.AVAILABLE) {
                return ValidationResult.invalid(
                        "Apartment is not available for assignment (Status: " + apartment.getStatus() + ")",
                        ErrorType.APARTMENT_NOT_FOUND
                );
            }
        }

        return ValidationResult.valid();
    }

    private UserRegistrationResult registerUser(ExcelUploadDTO data) {

        String plainPassword = data.getPassword() != null ?
                data.getPassword() : generateDefaultPassword();

        User user = User.builder()
                .firstname(data.getFirstname())
                .lastname(data.getLastname())
                .email(data.getEmail())
                .password(passwordEncoder.encode(plainPassword))
                .mustChangePassword(true)
                .role(Role.RESIDENT)
                .groups(new ArrayList<>())
                .build();

        userRepository.save(user);

        return UserRegistrationResult.builder()
                .user(user)
                .plainPassword(plainPassword)
                .build();
    }

    private void assignUserToApartment(User user, ExcelUploadDTO data) {

        if (data.getBuildingNumber() == null ||
                data.getApartmentNumber() == null ||
                data.getFloor() == null) {
            log.warn("Skipping apartment assignment for user {} - incomplete apartment data",
                    user.getEmail());
            return;
        }

        Apartment apartment = apartmentRepository
                .findByBuildingNumberAndFloorAndApartmentNumber(
                        data.getBuildingNumber(),
                        data.getFloor(),
                        data.getApartmentNumber()
                )
                .orElseThrow(() -> new ApartmentNotFoundException(
                        data.getApartmentNumber()
                ));

        apartment.setOwner(user);
        apartment.setStatus(ApartmentStatus.OCCUPIED);
        apartmentRepository.save(apartment);

        groupService.addUserToGroup(data.getBuildingNumber(), data.getBuildingAddress(), user, apartment);

        cacheService.evictAAllApartmentsByBuildingCache();
        cacheService.evictAllApartmentByFloorAndBuildingCache();
        cacheService.evictAvailableApartmentsInBuildingCache();

        log.info("Assigned user {} to apartment {} in building {}",
                user.getEmail(), apartment.getApartmentNumber(), data.getBuildingNumber());
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    private String generateDefaultPassword() {
        return "TempPassword" + System.currentTimeMillis();
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .userName(user.getName())
                .build();
    }

    @Data
    @AllArgsConstructor
    private static class ValidationResult {
        private boolean valid;
        private String errorMessage;
        private ErrorType errorType;

        static ValidationResult valid() {
            return new ValidationResult(true, null, null);
        }

        static ValidationResult invalid(String message, ErrorType type) {
            return new ValidationResult(false, message, type);
        }
    }

}
