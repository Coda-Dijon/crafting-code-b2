import fake.Client;
import fake.FakeNotifier;
import fake.ScenarioReceived;
import fake.ScenarioReceivedEventHandler;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FakeTests {
    @Test
    void shouldNotifyAllClientsWhenScenarioIsReceived() {
        var logs = new StringBuilder();
        var clients = List.of(
                new Client("Cliff Booth", "cliff.booth@double.com"),
                new Client("Rick Dalton", "rick.dalton@double.com")
        );

        var notifier = new FakeNotifier(text -> logs.append(text).append("\n"));
        var handler = new ScenarioReceivedEventHandler(notifier, clients);

        handler.handle(new ScenarioReceived("The 14 fists of McCluskey"));

        assertThat(logs.toString())
                .contains("Hello : Cliff Booth, I have just received a new scenario called 'The 14 fists of McCluskey' !!!")
                .contains("Hello : Rick Dalton, I have just received a new scenario called 'The 14 fists of McCluskey' !!!");
    }
}
