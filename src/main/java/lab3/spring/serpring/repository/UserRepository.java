package lab3.spring.serpring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lab3.spring.serpring.model.User;

/**
 * 
 * Anotação 'Repository' define a interface como uma camada de persistência.
 * 
 * Sua extensão da JpaRepository permite que as operações de um repositório
 * sejam realizadas em tempo de execução através do Spring Data JPA, que
 * receberá os dados parametrizados como User e Integer.
 *
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

}
