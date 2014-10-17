module SpaceCombat.Collision {
    export class DamageEvent {
        damage: number;
        index: number;

        constructor(damage: number, index: number) {
            this.damage = damage;
            this.index = index;
        } 
    }
} 