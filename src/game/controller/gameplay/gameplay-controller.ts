import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameConfig } from "../../data/game-config";
import { ScoreController } from "./score-controller";
import { LearningController } from "../ml/learning-controller";

export class GameplayController extends AbstractService {
  public static readonly key: string = "GameplayController";

  protected world: World = null;
  protected scoreController: ScoreController = null;
  protected learningController: LearningController = null;
  protected ended: boolean = false;

  constructor() {
    super(GameplayController.key);
  }

  public hasEnded(): boolean {
    return this.ended;
  }

  public init(): void {
    this.world = Game.getService<World>(World.key);
    this.scoreController = Game.getService<ScoreController>(ScoreController.key);
    this.learningController = Game.getService<LearningController>(LearningController.key);

    this.listenEvents();

    this.learningController.init();
  }

  public start(): void {
    this.learningController.start();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_changed", this.onTargetChanged, this);
  }

  protected onTargetChanged(): void {
    const target = this.world.getCurrentTarget();

    if (target === null) {
      this.handleNoTarget();
    }
  }

  protected handleNoTarget(): void {
    if (GameConfig.IsLearning) {
      const world = this.world;
      world.resetTargets();
      world.pickNextTarget();
      this.scoreController.reset();
    } else {
      this.endGameplay();
    }
  }

  protected endGameplay(): void {
    this.ended = true;
    this.learningController.stop();
    Game.events.emit("gameplay:end");
  }
}