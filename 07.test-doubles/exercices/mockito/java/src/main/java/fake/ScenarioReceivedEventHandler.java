package fake;

import java.util.List;

public class ScenarioReceivedEventHandler {
    private final Notifier notifier;
    private final List<Client> registeredUsers;

    public ScenarioReceivedEventHandler(Notifier notifier, List<Client> registeredUsers) {
        this.notifier = notifier;
        this.registeredUsers = registeredUsers;
    }

    public void handle(ScenarioReceived scenarioReceived) {
        registeredUsers.forEach(user -> notifier.notify(user, scenarioReceived));
    }
}
