package lab3.spring.serpring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lab3.spring.serpring.model.Serie;
import lab3.spring.serpring.service.SerieService;

/**
 * Controlador responsável por receber requisições REST das séries, como
 * adicionar, remover e atualizar.
 * 
 * Possui injeção de dependência ao serviço 'SerieService'.
 */
@RestController
public class SerieController {

	@Autowired
	private SerieService serieService;

	@RequestMapping(value = "/serie", method = RequestMethod.POST)
	public ResponseEntity<Serie> add(@RequestBody Serie serie) {
		Serie serieSubscribed = this.serieService.save(serie);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (serieSubscribed != null)
			status = HttpStatus.OK;
		return new ResponseEntity<Serie>(serieSubscribed, status);
	}

	@RequestMapping(value = "/serie/{serieId}", method = RequestMethod.DELETE)
	public ResponseEntity<Serie> remove(@PathVariable Integer serieId) {
		Serie serieRemoved = this.serieService.delete(serieId);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (serieRemoved != null)
			status = HttpStatus.OK;
		return new ResponseEntity<Serie>(serieRemoved, status);
	}

	@RequestMapping(value = "/serie/{serieId}", method = RequestMethod.PUT)
	public ResponseEntity<Serie> update(@RequestBody Serie serie, @PathVariable Integer serieId) {
		serie.setId(serieId);
		Serie serieUpdated = this.serieService.save(serie);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (serieUpdated != null)
			status = HttpStatus.OK;
		return new ResponseEntity<Serie>(serieUpdated, status);
	}

}
