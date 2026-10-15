package spy;

public class CreateAJokeUseCase {
    private final JokeRepository jokeRepository;

    public CreateAJokeUseCase(JokeRepository jokeRepository) {
        this.jokeRepository = jokeRepository;
    }

    public void handle(CreateJokeRequest request) {
        jokeRepository.save(new Joke(request.author(), request.text()));
    }
}
