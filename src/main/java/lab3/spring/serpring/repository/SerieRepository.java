package lab3.spring.serpring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lab3.spring.serpring.model.Serie;

/**
 * Anotação 'Repository' define a interface como uma camada de persistência.
 * 
 * Sua extensão da JpaRepository permite que as operações de um repositório
 * sejam realizadas em tempo de execução através do Spring Data JPA, que
 * receberá os dados parametrizados com os objetos Serie e Integer.
 */
@Repository
public interface SerieRepository extends JpaRepository<Serie, Integer> {

}
