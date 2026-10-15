# Global design research skill

Verified on 15 October 2026.

The user requested a reusable design research skill and a global writing rule. Both are installed outside this repository, so they apply to other workspaces on this computer.

## Installed files

| Purpose                     | Path                                                     |
| --------------------------- | -------------------------------------------------------- |
| Skill entrypoint            | `~/.agents/skills/design-research/SKILL.md`              |
| Saved reference catalog     | `~/.agents/skills/design-research/references/sources.md` |
| Skill picker metadata       | `~/.agents/skills/design-research/agents/openai.yaml`    |
| Legacy slash prompt alias   | `~/.codex/prompts/design-research.md`                    |
| Global writing instructions | `~/.codex/AGENTS.md`                                     |

## Invocation

In Codex CLI or the IDE extension, run `/skills` and select **Design Research**, or mention `$design-research` in a prompt. The user skill directory and these invocation methods are documented in [Build skills](https://learn.chatgpt.com/docs/build-skills).

The installed alias also supports `/prompts:design-research` in Codex clients that support custom prompts. Restart the CLI or reload the IDE extension if the alias does not appear. Custom prompts are deprecated, so the skill picker is the preferred route. The alias forwards to the same skill and accepts optional task text. Its doubled dollar sign correctly expands to a literal skill mention, as described in [Custom Prompts](https://learn.chatgpt.com/docs/custom-prompts).

A direct `/design-research` command is not documented or claimed. The alias has been inspected on disk; it has not been exercised in an interactive CLI session.

## Scope and saved references

The skill covers live design research, interaction observations, section or component planning, original adaptations, licensing and provenance, implementation, responsive checks, and motion verification. REA, Anatomy, Hairline, and Stitch are optional capabilities when they are installed and relevant.

The catalog contains all 12 supplied design and font references: Dwayne Koh, Cyera Secure the Unknown, Call to Inspiration, Uiverse and its three selected components, Neumorphism, Open Peeps, Bible Strong Avatar Lab, Shivaraja, and Ananda Neptouch 2. It also retains the five optional KrowdKraft content sources: Instagram, HackCulture, both Luma archives, and Medium. These are saved research inputs, not a claim that every page was inspected again during installation.

## Verification

- The official `skill-creator/scripts/quick_validate.py` validator reports `Skill is valid!`.
- The current session skill catalog discovers `design-research` at its global entrypoint.
- All 17 supplied URLs are present in the reference catalog.
- UI metadata has a valid default skill mention and permits normal implicit invocation.
- The global writing rule is present and loaded in the current session. It prohibits em dash punctuation and contractions in authored text while preserving exact code, source data, URLs, and third-party license text.
- No duplicate skill folder was created, and no commit, push, or deployment was performed for this installation.
