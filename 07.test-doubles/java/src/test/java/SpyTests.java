import org.junit.jupiter.api.Test;
import spy.CreateAJokeUseCase;
import spy.CreateJokeRequest;
import spy.Joke;
import spy.JokeRepository;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SpyTests {
    @Test
    void shouldSaveJokeWhenHandlingRequest() {
        var repository = new SpyJokeRepository();
        var useCase = new CreateAJokeUseCase(repository);
        var request = new CreateJokeRequest(
                "Anonymous",
                "Quelle partie du légume ne passe pas dans le mixer ? La chaise roulante"
        );

        useCase.handle(request);

        repository.shouldContain(request);
    }

    static class SpyJokeRepository implements JokeRepository {
        private final List<Joke> jokes = new ArrayList<>();

        @Override
        public void save(Joke joke) {
            jokes.add(joke);
        }

        public void shouldContain(CreateJokeRequest request) {
            assertThat(jokes)
                    .filteredOn(j -> j.author().equals(request.author()) && j.text().equals(request.text()))
                    .hasSize(1);
        }
    }
}
