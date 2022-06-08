interface AbilityConfig {
    id: string
    name: string
}

export const AbilityConfigs: Record<string, AbilityConfig> = {
    attack: {
        id: "attack",
        name: "Attack",
    },
    bash: {
        id: "bash",
        name: "Bash",
    },
}
