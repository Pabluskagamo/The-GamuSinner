import MultipleDirectionShot from "./multipleDirectionShot"
import NonePowerUp from "./nonePowerUp";

export class PowerUpFactory {
    static create(power, scene) {
        switch (power) {
            case "multipleDirectionShot": return new MultipleDirectionShot(scene)
            default: return new NonePowerUp(scene)
        }
    }

    static getCombo(power1, power2) {
        let combo = "none"
        if (MultipleDirectionShot.isCombo(power1, power2)) {
            combo = "multipleDirectionShot"
        }
        return combo
    }
}