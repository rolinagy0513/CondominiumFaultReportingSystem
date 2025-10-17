package org.example.condominiumfaultreportingsystem.security.user;

import jakarta.persistence.*;
import lombok.*;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.security.token.Token;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Model representing the User entity.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"groups"})
@ToString(exclude = {"groups"})
@Table(name = "_user")
@NamedEntityGraph(
        name = "Users.withGroups",
        attributeNodes = @NamedAttributeNode("groups")
)
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_generator")
  @SequenceGenerator(
          name = "users_generator",
          sequenceName = "users_id_seq",
          allocationSize = 1,
          initialValue = 22
  )
  private Long id;

  private String firstname;
  private String lastname;

  @Getter
  private String userName = firstname + " " + lastname;

  private String email;
  private String password;

  @Enumerated(EnumType.STRING)
  private Role role;

  @OneToMany(mappedBy = "user")
  private List<Token> tokens;

  @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY)
  private List<Apartment> ownedApartments = new ArrayList<>();

  @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
  private List<Group> groups = new ArrayList<>();

  @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
  private Company company;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @PrePersist
  protected void onCreate() {
    if (this.role == null) {
      this.role = Role.USER;
    }
    if (this.userName == null || this.userName.isBlank()) {
      this.userName = (firstname != null ? firstname : "") + " " + (lastname != null ? lastname : "");
      this.userName = this.userName.trim();
    }
  }

  public String getName(){
    return this.userName;
  }


}
