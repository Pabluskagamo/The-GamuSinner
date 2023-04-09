import MultipleDirectionShot from "./multipleDirectionShot"
import NonePowerUp from "./nonePowerUp";

export class PowerUpFactory {
    static create(power, scene) {
        let powerUp
        switch (power) {
            case "multipleDirectionShot": powerUp = new MultipleDirectionShot(scene)
                break;
            default: powerUp = new NonePowerUp(scene)
                break;
        }
        powerUp.collect()
        return powerUp
    }

    static getCombo(power1, power2) {
        let combo = "none"
        if (MultipleDirectionShot.isCombo(power1, power2)) {
            combo = "multipleDirectionShot"
        }
        return combo
    }
}