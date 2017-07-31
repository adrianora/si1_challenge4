package lab3.spring.serpring.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lab3.spring.serpring.model.Serie;
import lab3.spring.serpring.repository.SerieRepository;

/**
 * Serviço intermediador de ações externas ao repositório de séries
 * 
 * Possui métodos de salvar para adição e atualização de objetos, de remoção e
 * de retorno para lista de séries. Além de um builder que retorna a lista de
 * séries de um usuário específico
 * 
 * Possui injeção de dependência para repositório de séries.
 *
 */
@Service
public class SerieService {

	@Autowired
	private SerieRepository serieRepository;

	/**
	 * Adiciona série ao repositório.
	 */
	public Serie save(Serie serie) {
		return serieRepository.save(serie);
	}

	/**
	 * Deleta série pelo objeto.
	 */
	public Serie delete(Serie serie) {
		serieRepository.delete(serie);
		return serie;
	}

	/**
	 * Deleta série por identificador.
	 */
	public Serie delete(Integer serieID) {
		Serie serie = get(serieID);
		serieRepository.delete(serie);
		return serie;
	}

	/**
	 * Realiza busca no repositório por id. Se encontrar retorna o 
	 * objeto encontrado. Contrário retorna null.
	 */
	public Serie get(Integer serieID) {
		return serieRepository.findOne(serieID);
	}

	/**
	 * Retorna todas as séries presente no respositório como lista.
	 */
	public List<Serie> all() {
		return serieRepository.findAll();
	}

	/**
	 * Retorna lista com todas as séries de um usuário específico.
	 */
	public List<Serie> buildByUser(Integer userId) {
		List<Serie> allSeries = this.serieRepository.findAll();
		List<Serie> seriesFromUser = new ArrayList<Serie>();
		for (Serie serie : allSeries) {
			if (serie.getUserId().equals(userId))
				seriesFromUser.add(serie);
		}
		return seriesFromUser;
	}

}
