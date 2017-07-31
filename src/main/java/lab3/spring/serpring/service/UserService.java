package lab3.spring.serpring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lab3.spring.serpring.model.User;
import lab3.spring.serpring.repository.UserRepository;

/**
 * Serviço intermediador de ações externas ao repositório de usuários
 * 
 * Possui injeção de dependência para repositório de usuários.
 *
 */
@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public User add(User user) {
		this.userRepository.save(user);
		return this.userRepository.findOne(user.getId());
	}

	public User login(User user) {
		return login(user.getEmail(), user.getPass());
	}
	
	public User login(String email, String pass) {
		List<User> users = this.userRepository.findAll();
		for (User user : users) {
			if (user.getEmail().equals(email)) {
				if(user.getPass().equals(pass)) {
					return user;
				}
			}
		}
		return null;
	}

}
