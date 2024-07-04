export type TextureMap = {
  champ: {
    idle: HTMLImageElement;
    jump: HTMLImageElement;
    meleeAttack: HTMLImageElement;
    rangedAttack: HTMLImageElement;
    walk: HTMLImageElement;
    upLookWalk: HTMLImageElement;
  };
  grog: {
    walking: HTMLImageElement;
    jumpAndFall: HTMLImageElement;
    death: HTMLImageElement;
  };
};

const loadTexture = (path: string): Promise<HTMLImageElement> => {
  const basePath = import.meta.env.DEV ? "./src/assets" : "./assets";
  const src = `${basePath}/${path}`;

  const texture = new Image();
  texture.src = src;
  return new Promise((resolve, reject) => {
    texture.onload = () => {
      resolve(texture);
    };
    texture.onerror = () => {
      reject(`Could not load texture ${src}`);
    };
  });
};

export const initializeTextures = async () => {
  const [
    champIdle,
    champJump,
    champMeleeAttacks,
    champWalking,
    champRangedAttacks,
    champUpLookWalk,
    // Grog
    grogWalking,
    grogJumpAndFall,
    grogDeath,
  ] = await Promise.all(
    [
      "champ/idle.png",
      "champ/jumping.png",
      "champ/melee_attacks.png",
      "champ/walking.png",
      "champ/ranged_attacks.png",
      "champ/uplook_walking.png",

      "grog/enemy_walking.png",
      "grog/enemy_jump_and_fall.png",
      "grog/enemy_death.png",
    ].map(loadTexture)
  ).catch((error) => {
    console.error(error);
    throw new Error("Could not load textures");
  });
  const map: TextureMap = {
    champ: {
      idle: champIdle,
      jump: champJump,
      meleeAttack: champMeleeAttacks,
      rangedAttack: champRangedAttacks,
      walk: champWalking,
      upLookWalk: champUpLookWalk,
    },
    grog: {
      walking: grogWalking,
      jumpAndFall: grogJumpAndFall,
      death: grogDeath,
    },
  };
  textures = map;
};

let textures: TextureMap | undefined;

export const Textures = () => textures!;
