package lab3.spring.serpring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lab3.spring.serpring.model.Serie;
import lab3.spring.serpring.model.User;
import lab3.spring.serpring.service.SerieService;
import lab3.spring.serpring.service.UserService;

/**
 * Controlador responsável por receber requisições REST do usuário, como
 * autenticar e cadastrar novo usuário
 * 
 * Possui injeção de dependência aos serviços 'userService' e 'serieService'.
 *
 */
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private SerieService serieService;

	@RequestMapping(value = "/user", method = RequestMethod.POST)
	public ResponseEntity<User> add(@RequestBody User user) {
		User newUser = this.userService.add(user);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (newUser != null)
			status = HttpStatus.OK;
		return new ResponseEntity<User>(newUser, status);
	}

	@RequestMapping(value = "/user/{userID}/series", method = RequestMethod.GET)
	public ResponseEntity<List<Serie>> series(@PathVariable Integer userID) {
		List<Serie> seriesResponse = this.serieService.buildByUser(userID);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (seriesResponse != null)
			status = HttpStatus.OK;
		return new ResponseEntity<List<Serie>>(seriesResponse, status);
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<User> login(@RequestBody User user) {
		User session = this.userService.login(user);
		HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
		if (session != null)
			status = HttpStatus.OK;
		return new ResponseEntity<User>(session, status);
	}

}
