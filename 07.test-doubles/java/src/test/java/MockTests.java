import mock.Client;
import mock.Notifier;
import mock.ScenarioReceived;
import mock.ScenarioReceivedEventHandler;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class MockTests {
    @Test
    void shouldNotifyAllClientsWhenScenarioIsReceived() {
        var clients = List.of(
                new Client("Cliff Booth", "cliff.booth@double.com"),
                new Client("Rick Dalton", "rick.dalton@double.com")
        );

        var mockNotifier = new MockNotifier();
        var handler = new ScenarioReceivedEventHandler(mockNotifier, clients);
        var event = new ScenarioReceived("The 14 fists of McCluskey");

        handler.handle(event);

        assertThat(mockNotifier.hasBeenCalledForAll(clients, event)).isTrue();
    }

    static class MockNotifier implements Notifier {
        private final List<Map.Entry<Client, ScenarioReceived>> calls = new ArrayList<>();

        @Override
        public void notify(Client client, ScenarioReceived scenarioReceived) {
            calls.add(Map.entry(client, scenarioReceived));
        }

        public boolean hasBeenCalledForAll(List<Client> clients, ScenarioReceived event) {
            return clients.stream()
                    .allMatch(c -> calls.contains(Map.entry(c, event)));
        }
    }
}
