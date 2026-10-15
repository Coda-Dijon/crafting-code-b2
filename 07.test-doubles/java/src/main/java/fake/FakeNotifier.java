package fake;

import java.util.function.Consumer;

public class FakeNotifier implements Notifier {
    private final Consumer<String> output;

    public FakeNotifier(Consumer<String> output) {
        this.output = output;
    }

    @Override
    public void notify(Client client, ScenarioReceived scenarioReceived) {
        output.accept("Hello : " + client.name() +
                ", I have just received a new scenario called '" + scenarioReceived.title() + "' !!!");
    }
}
