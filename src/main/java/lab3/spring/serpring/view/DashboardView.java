package lab3.spring.serpring.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Camada de visualização que usa Thymeleaf como template engine para mapaear
 * rotas do Spring junto ao AngularJS
 *
 */
@Controller
public class DashboardView {

	@RequestMapping("/")
	public String dashboardView() {
		return "index";
	}

}
