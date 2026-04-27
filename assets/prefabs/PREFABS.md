# Prefab structures

## ui_button.prefab
- Node `UIButton`
  - Sprite (9-sliced frame: `resources/ui/button_default`)
  - Button component (normal/pressed/disabled sprites)
  - Label child `Text`

## hud.prefab
- Node `HUD`
  - TopBar (9-sliced panel)
    - Label `ChapterLabel`
    - Label `TimerLabel`
    - Button `PauseButton`

## panel_reading.prefab
- Node `ReadingPanel`
  - Sprite (9-sliced `resources/ui/panel_bg`)
  - Label `ReadingText`
  - Button `ListenButton`
  - Label `ResultLabel`

## panel_task.prefab
- Node `TaskPanel`
  - Sprite panel
  - Label `InstructionLabel`
  - Node `TaskSlot` (bind one of: PhotoTask, JumpTask, CraftTask)

## panel_reward.prefab
- Node `RewardPanel`
  - Sprite panel
  - Label `RewardText`
  - Sprite `RewardIcon`
  - Button `ContinueButton`
