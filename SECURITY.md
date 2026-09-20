# Security Policy

## Project security model

This project may be edited by an AI coding agent running in a remote,
third-party-hosted environment. Therefore, the repository must remain safe to
share, clone, and review.

Do not place secrets, personal data, production data, private infrastructure
details, or privileged credentials in this repository.

Security controls include:

- A GitHub fine-grained token limited to this repository.
- Feature-branch development and human-reviewed pull requests.
- No direct agent merges to `main`.
- Synthetic data and placeholder-only configuration examples.
- Manual review of changes to security-relevant files and dependencies.

These controls reduce risk but do not make the remote agent or repository a
safe place for secrets.

## Supported versions

Security fixes are applied to the current default branch (`main`).

| Version | Supported |
| --- | --- |
| `main` | Yes |
| Older commits, branches, and forks | No |

## Reporting a vulnerability

Do not report security issues through a public GitHub issue, pull request,
discussion, commit message, or chat transcript.

Report a vulnerability privately to the repository owner through the
repository's configured private reporting channel, if enabled. If no private
reporting channel is configured, contact the repository owner using a trusted
out-of-band method.

A useful report includes:

- A concise summary and impact assessment.
- Affected files, versions, or components.
- Reproduction steps using synthetic or redacted data only.
- Suggested mitigations, if known.
- Whether a secret, private data, or external service may be involved.

Do not include live credentials, personal data, private URLs, raw logs, or
exploit payloads that could cause harm.

## Handling accidental secrets

If a secret is committed, pasted into an issue/PR, included in a build log, or
otherwise exposed:

1. Treat it as compromised immediately.
2. Revoke or rotate it at the issuing provider.
3. Remove it from the active codebase and prevent recurrence with `.gitignore`,
   configuration changes, and safer placeholders.
4. Review pull requests, commits, GitHub Actions logs, release artifacts,
   branches, forks, caches, and external logs for exposure.
5. Rewrite Git history only after rotation/revocation; rewriting history does
   not unexpose a secret that may already have been copied.
6. Document the incident privately without including the secret value.

Never ask the remote AI agent to print, validate, compare, or “check whether”
a secret is valid.

## Configuration policy

- Commit `.env.example` files only, with placeholder values.
- Keep real `.env` files local or in a dedicated secret manager.
- Do not store credentials in source code, tests, documentation, shell
  scripts, Dockerfiles, container images, CI variables, or GitHub Actions
  workflow files.
- Do not use real production endpoints or databases in automated tests.
- Ensure logs redact authorization headers, cookies, bearer tokens, API keys,
  passwords, and connection strings.

Recommended `.gitignore` entries:

```gitignore
# Environment files
.env
.env.*
!.env.example

# Private keys and certificates
*.pem
*.key
*.p12
*.pfx

# Common local credential/config directories
.aws/
.ssh/
.gnupg/
credentials/
secrets/

# Infrastructure state and local databases
terraform.tfstate
terraform.tfstate.*
*.db
*.sqlite
*.sqlite3
```

## Dependency policy

- Prefer maintained dependencies with a clear purpose and compatible license.
- Pin or lock dependency versions where the ecosystem supports it.
- Review new dependencies before merging.
- Do not execute arbitrary installation scripts or curl-piped shell commands.
- Do not add unreviewed third-party CI actions or plugins.
- Treat dependency metadata, package scripts, generated code, and build output
  as untrusted until reviewed.

## AI agent policy

The remote AI agent may:

- Modify application source, tests, and documentation in feature branches.
- Run repository-scoped development and test commands.
- Create pull requests when granted the required GitHub permission.

The remote AI agent must not:

- Merge pull requests, push to `main`, force-push, or change Git history.
- Change repository settings, rulesets, visibility, collaborators, deploy keys,
  webhooks, secrets, environments, releases, or integrations.
- Modify CI/CD workflows without explicit human approval.
- Access, print, transmit, or commit secrets and personal/private data.
- Install unreviewed skills, plugins, global packages, or system software.
- Establish persistent network access, scheduled jobs, reverse tunnels, or
  external callbacks.

Any agent-generated change affecting authentication, authorization, cryptography,
data handling, network exposure, dependencies, containers, infrastructure, or
CI/CD requires manual human review before merge.

## Secure development expectations

Before merging a change:

- Review the diff and generated files.
- Run the relevant formatter, linter, type checker, and test suite.
- Confirm no secrets or sensitive data are included.
- Review dependency changes and lockfile updates.
- Confirm network behavior, authentication behavior, and data handling are
  appropriate for the project.
- For public repositories, assume all commits, issues, pull requests, Actions
  logs, and artifacts can be viewed by anyone.

## Scope

This policy applies to this repository only. It does not authorize access to
personal accounts, cloud services, local devices, private networks, or other
repositories.
