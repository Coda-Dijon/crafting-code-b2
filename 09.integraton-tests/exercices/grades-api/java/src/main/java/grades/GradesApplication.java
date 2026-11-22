package grades;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(
    title = "Grades API",
    version = "1.0",
    description = "API de gestion des notes étudiantes"
))
public class GradesApplication {
    public static void main(String[] args) {
        SpringApplication.run(GradesApplication.class, args);
    }
}
