import * as Matter from "matter-js";
import { Entity } from "../../../core/components/entity";
import { Vector2, Vector2Pool } from "../../../core/math/vector2";
import { GameConfig } from "../../data/game-config";

export class GameEntity extends Entity {
  protected body: Matter.Body = null;
  protected position: Vector2 = new Vector2();

  public getPosition(): Vector2 {
    return this.position.copyFrom(this.body.position);
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
    Matter.Body.setPosition(this.body, Matter.Vector.create(x, y));
  }

  public addToPhysicsWorld(world: Matter.World): void {
    Matter.World.addBody(world, this.body);
  }

  public reset(): void {}

  public update() {}

  public init(): void {
    this.initBody();
  }

  protected initBody(): void {
    const body = Matter.Bodies.circle(0, 0, this.getRadius(), {
      mass: this.getMass(),
      isStatic: this.isStatic(),
      restitution: this.getRestitution(),
      isSensor: this.isSensor(),
    });
    this.body = body;
    Matter.Body.setVelocity(body, Matter.Vector.create(0, 0));
  }

  public getRadius(): number {
    return 50 * GameConfig.UnitSize;
  }

  protected getMass(): number {
    return 1;
  }

  protected isStatic(): boolean {
    return false;
  }

  protected isSensor(): boolean {
    return false;
  }

  protected getRestitution(): number {
    return 0;
  }

  public destroy(): void {
    super.destroy();

    Vector2Pool.release(this.position);
    this.position = null;
    this.body = null;
  }
}
