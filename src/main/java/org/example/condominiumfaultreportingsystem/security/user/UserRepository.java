package org.example.condominiumfaultreportingsystem.security.user;

import java.util.List;
import java.util.Optional;

import org.example.condominiumfaultreportingsystem.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;

/**
 * Repository interface for managing User entities.
 * Provides methods to search the user by email, ID.
 * And a flexible search query that can retrieve users from their usernames
 */
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  List<User> findAllByIdNot(Long id);

    boolean existsByEmail(String email);

  Long company(Company company);
}
