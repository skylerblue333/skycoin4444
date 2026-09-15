export type CourseQuestion = {
  prompt: string;
  choices: readonly string[];
  correctIndex: number;
};

export type CourseLesson = {
  id: string;
  title: string;
  objective: string;
  summary: string;
  question: CourseQuestion;
};

export type GapCourse = {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate';
  lessons: readonly CourseLesson[];
};

const q = (prompt: string, choices: readonly string[], correctIndex: number): CourseQuestion => ({ prompt, choices, correctIndex });
const lesson = (id: string, title: string, objective: string, summary: string, question: CourseQuestion): CourseLesson => ({ id, title, objective, summary, question });

export const gapCourses: readonly GapCourse[] = [
  {
    id: 'wallet-security-101', title: 'Wallet Security & Self-Custody', level: 'beginner', lessons: [
      lesson('keys', 'Keys and Control', 'Distinguish public addresses from private signing material.', 'A public address can be shared to receive assets. A private key or recovery phrase controls signing authority and should not be disclosed.', q('Which item must remain secret?', ['Public address', 'Private key', 'Block height'], 1)),
      lesson('recovery', 'Recovery Planning', 'Build an offline recovery plan.', 'Recovery material should be backed up in a durable, private location with clear inheritance or emergency procedures appropriate to the user.', q('What is the safest default for recovery phrases?', ['Post online', 'Store privately offline', 'Send in chat'], 1)),
      lesson('phishing', 'Phishing Defense', 'Recognize social-engineering pressure.', 'Wallet theft commonly starts with fake support, urgent links, copied domains, or requests to reveal recovery material. Verify independently before acting.', q('A support agent asks for your seed phrase. What should you do?', ['Provide it', 'Refuse and verify independently', 'Share half'], 1)),
      lesson('transactions', 'Transaction Verification', 'Verify destination and intent before signing.', 'Signing approves data presented by a wallet. Users should verify destination, network, value, and contract intent rather than treating prompts as harmless logins.', q('Before signing, which detail matters?', ['Destination and intent', 'Screen brightness', 'Username length'], 0)),
      lesson('wallet-types', 'Wallet Types', 'Compare convenience and isolation tradeoffs.', 'Software wallets are convenient; hardware devices can isolate signing keys. Neither eliminates phishing or user-verification responsibilities.', q('Hardware wallets primarily help by?', ['Guaranteeing profit', 'Isolating signing keys', 'Removing all scams'], 1)),
      lesson('response', 'Incident Response', 'Respond to suspected compromise.', 'If signing material may be exposed, stop using the compromised environment, preserve evidence, move unaffected assets only through a trusted setup, and review connected permissions.', q('What is a sound first response to suspected compromise?', ['Ignore it', 'Continue signing', 'Stop and assess from a trusted setup'], 2)),
    ]
  },
  {
    id: 'blockchain-101', title: 'Blockchain Fundamentals', level: 'beginner', lessons: [
      lesson('blocks', 'Blocks and Transactions', 'Explain how transactions are grouped.', 'Blockchains order signed transactions into blocks or equivalent ledger structures so participants can agree on state history.', q('What do blocks primarily organize?', ['Transactions', 'Passwords', 'Web cookies'], 0)),
      lesson('hashes', 'Hashes and Integrity', 'Describe hash-based integrity checks.', 'Cryptographic hashes produce deterministic fingerprints. Changing input data changes the digest, which helps reveal tampering.', q('Changing hashed input usually does what?', ['Keeps digest identical', 'Changes the digest', 'Deletes the network'], 1)),
      lesson('nodes', 'Nodes and Replication', 'Understand replicated validation.', 'Nodes exchange and validate ledger data according to protocol rules. Different node roles can trade resource use for verification depth.', q('Nodes commonly do what?', ['Validate protocol data', 'Set universal prices', 'Recover lost passwords'], 0)),
      lesson('consensus', 'Consensus', 'Compare agreement mechanisms conceptually.', 'Consensus mechanisms coordinate which state updates are accepted. Their security assumptions, costs, and finality models differ.', q('Consensus mechanisms coordinate?', ['Accepted state', 'Email delivery', 'Device charging'], 0)),
      lesson('finality', 'Finality and Confirmations', 'Explain why settlement confidence changes over time.', 'Some systems provide probabilistic confirmation while others provide stronger finality after protocol-specific checkpoints. Applications should model that difference.', q('Finality describes?', ['Confidence that state will not revert', 'Wallet color', 'Token logo'], 0)),
      lesson('explorers', 'Explorers and Verification', 'Use public ledger data carefully.', 'Explorers help inspect addresses, transactions, blocks, and contract events, but interfaces can be wrong or malicious; verify critical facts with trusted sources.', q('Explorers are useful for?', ['Inspecting ledger data', 'Obtaining private keys', 'Guaranteeing identity'], 0)),
    ]
  },
  {
    id: 'smart-contract-security-201', title: 'Smart Contract Security', level: 'intermediate', lessons: [
      lesson('access', 'Access Control', 'Identify authorization boundaries.', 'Privileged functions should explicitly verify who may call them and should minimize admin power where possible.', q('Privileged functions need?', ['Explicit authorization', 'Random names', 'More animations'], 0)),
      lesson('reentrancy', 'Reentrancy', 'Recognize external-call ordering risk.', 'External calls can transfer control to untrusted code. State updates and interaction ordering should be designed to prevent repeated execution.', q('Reentrancy risk involves?', ['Unexpected repeated control flow', 'Image caching', 'DNS only'], 0)),
      lesson('inputs', 'Validation and Invariants', 'Validate state transitions.', 'Contracts should reject malformed inputs and preserve invariants across every reachable state transition.', q('An invariant is?', ['A property that should remain true', 'A wallet theme', 'A gas token'], 0)),
      lesson('oracles', 'Oracle Risk', 'Model external-data assumptions.', 'Contracts consuming external prices or events inherit oracle latency, manipulation, availability, and trust risks.', q('Oracle-dependent contracts inherit?', ['External data risk', 'No risk', 'Only UI risk'], 0)),
      lesson('upgrades', 'Upgradeability', 'Understand upgrade authority.', 'Upgradeable systems add governance, storage-layout, compatibility, and key-management risks. Users should know who can change logic.', q('Upgradeability adds?', ['Authority and compatibility risk', 'Guaranteed safety', 'Free finality'], 0)),
      lesson('testing', 'Testing and Review', 'Use layered verification.', 'Unit, invariant, integration, fuzz, and independent review approaches catch different classes of defects; no single method proves complete safety.', q('One test type proves a contract perfectly safe?', ['Yes', 'No'], 1)),
    ]
  },
  {
    id: 'tokenomics-201', title: 'Tokenomics & Digital Assets', level: 'intermediate', lessons: [
      lesson('supply', 'Supply Models', 'Compare fixed and variable supply.', 'Token supply rules may cap issuance, schedule emissions, burn units, or respond to protocol state. Supply alone does not determine value.', q('Supply alone determines token value?', ['Yes', 'No'], 1)),
      lesson('emissions', 'Issuance and Emissions', 'Read emission schedules.', 'Emission schedules affect dilution and incentives. Analysis should distinguish circulating, unlocked, reserved, and maximum supply.', q('New issuance can cause?', ['Dilution', 'Guaranteed appreciation', 'Password reset'], 0)),
      lesson('utility', 'Utility and Rights', 'Separate technical utility from legal claims.', 'Tokens may represent access, governance, accounting units, or other functions; technical labels do not establish legal status or financial rights.', q('Technical token labels establish legal status automatically?', ['Yes', 'No'], 1)),
      lesson('incentives', 'Incentive Design', 'Identify participant incentives.', 'Rewards can bootstrap behavior but may attract short-term exploitation if incentives are not aligned with durable system goals.', q('Poor incentives can?', ['Create exploitation', 'Eliminate gaming', 'Guarantee retention'], 0)),
      lesson('governance', 'Governance Power', 'Assess voting concentration.', 'Voting systems can concentrate power through holdings, delegation, low turnout, or privileged roles. Distribution metrics should be read with governance rules.', q('Large holdings may affect?', ['Voting concentration', 'Hash spelling', 'Screen size'], 0)),
      lesson('risk', 'Tokenomics Risk Review', 'Evaluate assumptions instead of price promises.', 'A sound review examines issuance, unlocks, liquidity, control, treasury policy, dependencies, and failure cases without promising returns.', q('A responsible review should avoid?', ['Guaranteed return claims', 'Supply analysis', 'Risk scenarios'], 0)),
    ]
  },
  {
    id: 'web3-dev-201', title: 'Web3 Development Foundations', level: 'intermediate', lessons: [
      lesson('rpc', 'RPC and Nodes', 'Explain client-node communication.', 'Applications commonly use RPC endpoints to query chain state and submit signed transactions. RPC availability is not the same as chain finality.', q('RPC endpoints commonly provide?', ['Chain access', 'Private-key recovery', 'Legal approval'], 0)),
      lesson('wallet', 'Wallet Connections', 'Treat wallet connections as capability boundaries.', 'Connecting a wallet typically reveals an address or session capability; it should not automatically authorize unrelated actions.', q('Connecting a wallet should automatically authorize everything?', ['Yes', 'No'], 1)),
      lesson('signing', 'Messages and Transactions', 'Separate message signatures from transactions.', 'A message signature proves control over a key for specific data; a transaction requests a state change and can carry fees or value.', q('A transaction can?', ['Request state change', 'Reveal the seed by design', 'Guarantee confirmation'], 0)),
      lesson('contracts', 'Contract Calls', 'Distinguish reads from writes.', 'Read-only calls inspect state, while state-changing calls usually require a signed transaction and protocol fees.', q('State-changing calls commonly require?', ['Signed transactions', 'Only CSS', 'No authorization ever'], 0)),
      lesson('events', 'Events and Indexing', 'Understand event-driven indexing.', 'Applications often index emitted events for discovery and analytics, while authoritative state remains governed by the chain and contract logic.', q('Events are often used for?', ['Indexing and discovery', 'Seed storage', 'Replacing consensus'], 0)),
      lesson('testnets', 'Testing Environments', 'Use isolated environments before real assets.', 'Local nodes, simulators, and test networks let developers validate flows without claiming production settlement or risking real funds.', q('Why use test environments?', ['Validate safely', 'Guarantee mainnet behavior', 'Avoid all testing'], 0)),
    ]
  },
  {
    id: 'dao-201', title: 'DAOs & On-Chain Governance', level: 'intermediate', lessons: [
      lesson('proposals', 'Proposals', 'Describe proposal lifecycles.', 'Governance proposals usually define an action, voting window, eligibility rules, quorum conditions, and execution path.', q('A proposal commonly has?', ['Voting rules', 'Private seed', 'Guaranteed passage'], 0)),
      lesson('voting', 'Voting Models', 'Compare voting mechanisms.', 'One-token-one-vote, delegated voting, quadratic approaches, councils, and hybrids produce different power distributions and attack surfaces.', q('Voting models affect?', ['Power distribution', 'Only colors', 'Hash length'], 0)),
      lesson('delegation', 'Delegation', 'Understand representative voting.', 'Delegation lets participants assign voting power without necessarily transferring the underlying asset, depending on protocol design.', q('Delegation commonly assigns?', ['Voting power', 'Private keys', 'Identity documents'], 0)),
      lesson('treasury', 'Treasury Governance', 'Apply controls to collective funds.', 'Treasuries benefit from explicit mandates, spending limits, multisignature or policy controls, transparent reporting, and emergency procedures.', q('Treasury controls should emphasize?', ['Explicit authorization', 'Secret spending', 'Unlimited keys'], 0)),
      lesson('attacks', 'Governance Attacks', 'Recognize capture and manipulation.', 'Low turnout, borrowed voting power, bribery, compromised delegates, and rushed execution can undermine governance.', q('Low turnout can increase?', ['Capture risk', 'Storage size only', 'Password strength'], 0)),
    ]
  },
  {
    id: 'crypto-risk-201', title: 'Crypto Risk Management', level: 'intermediate', lessons: [
      lesson('volatility', 'Volatility', 'Plan for large price moves.', 'Volatile assets can move sharply in either direction. Risk planning should not assume recent prices or trends will persist.', q('Volatility means?', ['Prices can move sharply', 'Prices only rise', 'Settlement is instant'], 0)),
      lesson('sizing', 'Position Sizing', 'Limit exposure relative to loss tolerance.', 'Position sizing caps how much one outcome can damage a portfolio or operating budget; leverage increases sensitivity and liquidation risk.', q('Leverage generally?', ['Amplifies exposure', 'Removes risk', 'Guarantees liquidity'], 0)),
      lesson('counterparty', 'Counterparty Risk', 'Identify reliance on custodians and intermediaries.', 'Exchanges, bridges, custodians, issuers, and service providers can fail operationally, financially, or through compromise.', q('Counterparty risk comes from?', ['Reliance on another party', 'Only price charts', 'Token symbols'], 0)),
      lesson('liquidity', 'Liquidity Risk', 'Understand execution under stress.', 'Thin markets can create slippage, delayed exits, or unavailable counterparties, especially during high volatility.', q('Thin liquidity can cause?', ['Slippage', 'Guaranteed fills', 'Lower key risk'], 0)),
      lesson('contract', 'Protocol Risk', 'Model smart-contract and governance dependencies.', 'Using a protocol means relying on its code, admin keys, oracles, governance, integrations, and economic assumptions.', q('Protocol risk includes?', ['Code and governance dependencies', 'No dependencies', 'Only branding'], 0)),
      lesson('scams', 'Scam Detection', 'Use independent verification.', 'Urgency, guaranteed returns, impersonation, unsolicited recovery help, and secret-reveal requests are warning signs. Verify through independent channels.', q('Guaranteed-return messages should be treated as?', ['A warning sign', 'Proof of safety', 'Mandatory advice'], 0)),
    ]
  },
  {
    id: 'nft-101', title: 'NFTs & Digital Ownership', level: 'beginner', lessons: [
      lesson('tokens', 'Unique Tokens', 'Explain non-fungible identifiers.', 'NFT systems track distinct token identifiers and ownership records. Ownership of a token does not automatically convey copyright or every associated right.', q('NFT ownership automatically transfers all copyright?', ['Yes', 'No'], 1)),
      lesson('metadata', 'Metadata', 'Understand off-chain references.', 'Metadata can describe names, images, traits, or external resources and may live on-chain or reference separate storage systems.', q('NFT metadata may?', ['Reference external storage', 'Always contain a seed phrase', 'Guarantee permanence'], 0)),
      lesson('provenance', 'Provenance', 'Trace issuance and transfers.', 'Ledger history can help trace token creation and transfers, but it does not independently prove the real-world authenticity of referenced media.', q('On-chain provenance proves every real-world claim?', ['Yes', 'No'], 1)),
      lesson('rights', 'Licensing and Rights', 'Read associated terms.', 'Creators can attach licenses or terms, but buyers should verify what rights are actually granted rather than infer them from token ownership.', q('Rights should be determined from?', ['Actual terms', 'Token price alone', 'Profile picture'], 0)),
      lesson('storage', 'Storage Tradeoffs', 'Compare persistence assumptions.', 'HTTP, content-addressed networks, centralized hosts, and on-chain storage each have availability, cost, and permanence tradeoffs.', q('Storage choices involve?', ['Tradeoffs', 'No dependencies', 'Guaranteed permanence'], 0)),
    ]
  },
  {
    id: 'layer2-201', title: 'Layer 2 Scaling', level: 'intermediate', lessons: [
      lesson('purpose', 'Why Layer 2', 'Explain scaling goals.', 'Layer 2 systems move some execution or data handling away from a base layer while relying on defined mechanisms to settle or verify outcomes.', q('Layer 2 systems primarily aim to?', ['Scale activity', 'Reveal keys', 'Replace all networks'], 0)),
      lesson('rollups', 'Rollups', 'Compare optimistic and validity approaches conceptually.', 'Rollups batch activity and publish proofs or commitments to a base layer. Security and withdrawal assumptions vary by design.', q('Rollups commonly?', ['Batch activity', 'Eliminate all trust', 'Store seed phrases'], 0)),
      lesson('bridges', 'Bridges', 'Model cross-domain transfer risk.', 'Bridges coordinate assets or messages across systems and may rely on contracts, validators, proofs, or custodians. They add a distinct security boundary.', q('Bridges add?', ['A security boundary', 'Guaranteed safety', 'No dependencies'], 0)),
      lesson('data', 'Data Availability', 'Understand access to transaction data.', 'Users or verifiers need enough data to reconstruct or validate state transitions according to the system design.', q('Data availability matters for?', ['Verification and reconstruction', 'Logo design', 'Password hints'], 0)),
      lesson('finality', 'Finality and Withdrawals', 'Distinguish L2 confirmation from base settlement.', 'An L2 may show a transaction as confirmed before every base-layer challenge or proof condition has completed.', q('L2 confirmation is always identical to base-layer finality?', ['Yes', 'No'], 1)),
      lesson('safety', 'User Safety', 'Verify networks and withdrawal paths.', 'Users should verify network identifiers, official bridge paths, fees, finality assumptions, and recovery options before moving valuable assets.', q('Before bridging, users should verify?', ['Network and bridge path', 'Only token logo', 'Nothing'], 0)),
    ]
  },
  {
    id: 'product-thinking-101', title: 'Product Thinking & Better Decisions', level: 'beginner', lessons: [
      lesson('problems', 'Start With the Problem', 'Separate a user problem from a feature idea.', 'Strong products begin with a specific problem, a person affected by it, and evidence that the problem matters. A feature is only one possible response.', q('A useful product problem statement should describe?', ['A specific user problem', 'A list of trendy features', 'A guaranteed valuation'], 0)),
      lesson('users', 'Understand the User', 'Identify context, constraints, and desired outcomes.', 'Interviews, observation, support records, and behavioral evidence help teams understand what people are trying to accomplish and what makes the current path difficult.', q('Good user research focuses on?', ['Goals and context', 'Only preferred colors', 'Invented testimonials'], 0)),
      lesson('loops', 'Design a Complete Loop', 'Map the path from entry to return.', 'A product loop should let someone enter, do something valuable, save or share the result, and know what to do next. Stopping after a button click is not a complete loop.', q('A complete product loop should include?', ['Value and a next step', 'Only a landing page', 'A hidden state'], 0)),
      lesson('metrics', 'Choose Useful Metrics', 'Distinguish outcome metrics from vanity counts.', 'Activation, completion, retention, failure rate, and time to value explain product health better than route counts or inflated audience claims.', q('Which is closer to an outcome metric?', ['Lesson completion rate', 'Number of menu items', 'Unverified follower count'], 0)),
      lesson('experiments', 'Run Small Experiments', 'Test one assumption at a time.', 'A good experiment states the assumption, defines a measurable result, limits risk, and records what happened. Small tests reduce wasted work and make learning faster.', q('A good experiment should?', ['Test a clear assumption', 'Hide negative results', 'Change five variables at once'], 0)),
    ]
  },
  {
    id: 'web-safety-101', title: 'Web Safety & Privacy Basics', level: 'beginner', lessons: [
      lesson('permissions', 'Permissions', 'Review what a website is allowed to access.', 'Camera, microphone, location, notifications, and file permissions should be requested at the moment of need and denied when unnecessary.', q('A safe permission pattern is to?', ['Request only what is needed', 'Request everything on load', 'Hide the purpose'], 0)),
      lesson('accounts', 'Account Hygiene', 'Use strong, unique access practices.', 'Unique passwords, a password manager, multi-factor authentication, and session review reduce the impact of reused credentials and stolen sessions.', q('Why use unique passwords?', ['One breach should not unlock every account', 'They guarantee no phishing', 'They remove the need for recovery'], 0)),
      lesson('phishing', 'Phishing Signals', 'Recognize urgency and impersonation.', 'Unexpected urgency, lookalike domains, unusual payment requests, and requests for secrets are common warning signs. Verify through a known channel.', q('Which is a warning sign?', ['Urgent request for a secret', 'A normal help article', 'A visible privacy policy'], 0)),
      lesson('sharing', 'Share Less by Default', 'Reduce unnecessary personal-data exposure.', 'Before sharing, ask who needs the information, how long it will be kept, and whether a less identifying alternative would work.', q('Data minimization means?', ['Collecting and sharing only what is needed', 'Keeping every detail forever', 'Publishing by default'], 0)),
      lesson('incidents', 'Respond to an Incident', 'Take calm, reversible steps after a mistake.', 'Revoke exposed sessions or keys, change affected credentials from a trusted device, preserve evidence, notify the right service, and avoid spreading the secret further.', q('After exposing a password, the first step is usually to?', ['Revoke or change it from a trusted path', 'Post it as a warning', 'Ignore it'], 0)),
    ]
  },
  {
    id: 'data-literacy-101', title: 'Data Literacy for Everyday Decisions', level: 'beginner', lessons: [
      lesson('questions', 'Ask the Right Question', 'Turn a vague concern into a measurable question.', 'A clear question names the population, time period, comparison, and outcome. Ambiguous questions invite misleading conclusions.', q('A measurable question should define?', ['What, for whom, and when', 'Only a chart color', 'A conclusion first'], 0)),
      lesson('averages', 'Read Averages Carefully', 'Understand what a summary hides.', 'Mean, median, range, and distribution answer different questions. Averages can conceal outliers, uneven groups, or missing data.', q('The median is useful when?', ['Outliers would distort the mean', 'Every value is identical', 'There is no data'], 0)),
      lesson('correlation', 'Correlation Is Not Causation', 'Avoid treating association as proof of cause.', 'Two measures can move together because of coincidence, reverse direction, a shared cause, or selection effects. Causal claims need stronger evidence.', q('Correlation alone proves?', ['An association', 'The exact cause', 'A guaranteed forecast'], 0)),
      lesson('samples', 'Samples and Bias', 'Recognize who is missing from a dataset.', 'A sample may overrepresent people who respond, have access, or remain visible. Good analysis describes the sample and its limits.', q('Sampling bias occurs when?', ['Some groups are systematically over- or under-represented', 'Every person is included', 'The chart has labels'], 0)),
      lesson('uncertainty', 'Communicate Uncertainty', 'Make room for error and changing evidence.', 'Ranges, confidence limits, caveats, and updated measurements help people avoid false precision. Uncertainty is information, not failure.', q('Responsible data communication should?', ['State important limitations', 'Hide uncertainty', 'Promise exact outcomes'], 0)),
    ]
  },
  {
    id: 'creator-communication-101', title: 'Creator Communication Essentials', level: 'beginner', lessons: [
      lesson('audience', 'Know the Audience', 'Choose language for a specific audience.', 'A useful creator message names who it helps, what problem it addresses, and what the audience should do next.', q('A focused message should name?', ['Audience and outcome', 'Only a color', 'A secret metric'], 0)),
      lesson('hooks', 'Strong Openings', 'Create honest attention without misleading claims.', 'An opening can state the tension, question, or promised learning clearly. Avoid urgency, guarantees, and exaggerated proof.', q('A responsible hook should avoid?', ['Guaranteed outcomes', 'A clear question', 'Specific context'], 0)),
      lesson('accessibility', 'Accessible Formats', 'Make content easier to understand and use.', 'Captions, readable contrast, descriptive labels, structured headings, and plain language widen participation without changing the core idea.', q('Captions primarily improve?', ['Access to spoken content', 'Token value', 'Password strength'], 0)),
      lesson('feedback', 'Use Feedback Well', 'Turn reactions into actionable learning.', 'Separate a preference from a reproducible issue, look for patterns, and record what changed after a test rather than chasing every reaction.', q('Useful feedback should be?', ['Specific enough to act on', 'Always positive', 'Kept secret'], 0)),
      lesson('disclosure', 'Disclose Clearly', 'Make sponsorship and limitations visible.', 'People should be able to distinguish personal experience, paid promotion, affiliate relationships, and unverified claims before relying on content.', q('Clear disclosure helps people?', ['Interpret incentives and limits', 'Guarantee a result', 'Skip verification'], 0)),
    ]
  },
  {
    id: 'digital-wellbeing-101', title: 'Digital Wellbeing & Boundaries', level: 'beginner', lessons: [
      lesson('attention', 'Protect Attention', 'Design intentional notification habits.', 'Notifications compete for attention. Batching, quiet periods, and turning off nonessential alerts can make technology serve a chosen goal.', q('A useful attention practice is?', ['Batching nonessential alerts', 'Enabling every alert', 'Removing all goals'], 0)),
      lesson('boundaries', 'Set Boundaries', 'Communicate availability and limits.', 'A boundary can state when you are available, which channels you use, and what kind of response time people should expect.', q('A boundary should be?', ['Clear and communicated', 'A hidden test', 'Impossible to follow'], 0)),
      lesson('consent', 'Consent Online', 'Respect participation and sharing choices.', 'Ask before recording, reposting, tagging, or adding someone to a group. Consent should be informed, specific, and reversible where practical.', q('Before reposting someone’s private message, you should?', ['Ask permission', 'Assume consent', 'Remove context'], 0)),
      lesson('conflict', 'Handle Conflict', 'De-escalate disagreement in digital spaces.', 'Pause before replying, separate intent from impact, move sensitive issues to an appropriate channel, and use reporting tools for abuse or threats.', q('A de-escalating first step is?', ['Pause and clarify', 'Escalate immediately', 'Publish private details'], 0)),
      lesson('rest', 'Build Recovery Time', 'Use technology without making constant availability the default.', 'Regular offline time, sleep protection, movement, and real-world relationships support sustainable participation better than endless engagement metrics.', q('Sustainable participation needs?', ['Recovery time', 'Constant availability', 'More notifications'], 0)),
    ]
  },
  {
    id: 'ai-literacy-101', title: 'Practical AI Literacy', level: 'beginner', lessons: [
      lesson('capabilities', 'Know the Boundary', 'Distinguish generated output from verified facts.', 'An AI system can produce useful drafts while still being wrong, incomplete, or unable to access the context a user assumes it has.', q('Generated output should be?', ['Reviewed before reliance', 'Treated as guaranteed fact', 'Presented as human memory'], 0)),
      lesson('prompts', 'Give Useful Context', 'Write goals and constraints clearly.', 'A good request describes the task, audience, format, constraints, examples, and what a successful answer should include.', q('Useful context includes?', ['Goal and constraints', 'Only a greeting', 'A hidden password'], 0)),
      lesson('privacy', 'Protect Sensitive Data', 'Minimize information shared with tools.', 'Do not paste secrets, credentials, private keys, unnecessary personal data, or confidential business material into an AI tool without an approved handling policy.', q('What should never be pasted into an unapproved AI tool?', ['Private keys and credentials', 'A public topic', 'A formatting preference'], 0)),
      lesson('verification', 'Verify Important Claims', 'Use trusted sources for consequential decisions.', 'For medical, legal, financial, safety, or operational decisions, check primary sources and qualified professionals rather than treating a fluent response as proof.', q('Consequential claims need?', ['Independent verification', 'More confidence wording', 'No sources'], 0)),
      lesson('human-loop', 'Keep Human Review', 'Assign responsibility for the final decision.', 'Automation can accelerate work, but a responsible person should review outputs, handle exceptions, and own the decision when stakes are meaningful.', q('A human review loop provides?', ['Accountability and exception handling', 'Guaranteed accuracy', 'Invisible automation'], 0)),
    ]
  },
  {
    id: 'crypto-payments-safety-201', title: 'Crypto Payments & Tip Safety', level: 'intermediate', lessons: [
      lesson('recipient', 'Verify the Recipient', 'Confirm who controls the destination before sending.', 'A display name is not proof of address control. Confirm the recipient and destination through a trusted channel, especially when instructions change unexpectedly.', q('A changed payment address should be?', ['Verified through a trusted channel', 'Accepted immediately', 'Shared publicly'], 0)),
      lesson('network', 'Match the Network', 'Prevent destination and network mismatches.', 'The same asset label can exist on different networks. Confirm the exact network, address format, memo or tag requirements, and recipient support before authorizing a transfer.', q('Before a transfer, verify?', ['Network and destination format', 'Only the token logo', 'Follower count'], 0)),
      lesson('test', 'Start With a Test', 'Use a small test when the workflow or destination is new.', 'A small test can catch address, network, memo, and operational mistakes before the full intended amount is exposed.', q('Why send a small test first?', ['To catch setup mistakes', 'To guarantee profit', 'To skip recipient verification'], 0)),
      lesson('fees', 'Review Amount and Fees', 'Distinguish the intended amount from network and provider costs.', 'Check the asset, amount, fee, final recipient amount, and whether the fee can change. Never treat an estimated quote as completed settlement.', q('A quote is the same as final settlement?', ['Yes', 'No'], 1)),
      lesson('irreversible', 'Understand Irreversibility', 'Plan for transfers that cannot be reversed.', 'Many blockchain transfers cannot be cancelled after broadcast. Stop when pressured, verify every field, and keep records appropriate to the transaction.', q('Pressure to send immediately is a reason to?', ['Pause and verify', 'Skip checks', 'Reveal a recovery phrase'], 0)),
    ]
  },
  {
    id: 'social-community-201', title: 'Healthy Social Communities', level: 'intermediate', lessons: [
      lesson('identity', 'Identity Without Overclaiming', 'Separate profile claims from verified identity.', 'A name, badge, avatar, or biography can be useful context but should not be presented as independent identity proof without a real verification process.', q('A profile badge alone proves identity?', ['Yes', 'No'], 1)),
      lesson('moderation', 'Moderation Basics', 'Design clear rules and proportionate responses.', 'Healthy moderation defines prohibited behavior, documents decisions, provides reporting tools, and uses escalation paths proportionate to risk.', q('Good moderation needs?', ['Clear rules and escalation', 'Secret punishments', 'No reporting path'], 0)),
      lesson('media', 'Share Media Responsibly', 'Check consent, context, and rights before posting.', 'Before uploading or linking media, confirm permission, avoid exposing private information, add useful context, and provide captions or descriptions.', q('Before sharing someone else’s media, check?', ['Permission and privacy', 'Only file size', 'Token price'], 0)),
      lesson('tips', 'Creator Tip Boundaries', 'Distinguish appreciation from financial promises.', 'A tip should never buy guaranteed influence, investment returns, or unsafe access. Platforms need authorization, receipts, disputes, fraud controls, and transparent fees before moving value.', q('A real tip system needs?', ['Authorization and receipts', 'Only an emoji', 'Guaranteed returns'], 0)),
      lesson('wellbeing', 'Design for Wellbeing', 'Avoid engagement patterns that reward conflict or compulsion.', 'Useful communities support pacing, control over notifications, blocking and reporting, and meaningful goals instead of endless urgency.', q('A wellbeing feature is?', ['Notification control', 'Forced endless scrolling', 'Hidden reporting'], 0)),
    ]
  },
  {
    id: 'dating-safety-101', title: 'Online Dating Safety & Consent', level: 'beginner', lessons: [
      lesson('adults', 'Adults-Only Boundaries', 'Keep adult dating spaces restricted to adults.', 'Dating products need a clear 18+ boundary, truthful age information, and escalation procedures for suspected minors or age misrepresentation.', q('An adult dating beta should be?', ['18+ only', 'Open to any age', 'Unlabeled'], 0)),
      lesson('privacy', 'Protect Personal Information', 'Share identifying details gradually.', 'Avoid publishing home addresses, financial credentials, recovery phrases, identity documents, or routine details that create unnecessary risk.', q('Which should stay private?', ['Financial credentials', 'A favorite movie', 'A public hobby'], 0)),
      lesson('consent', 'Consent Is Ongoing', 'Recognize specific, voluntary, reversible consent.', 'Consent is not implied by a match, prior conversation, gift, or date. People can change their mind, and pressure is incompatible with consent.', q('A match automatically creates consent?', ['Yes', 'No'], 1)),
      lesson('meeting', 'Meet More Safely', 'Plan early meetings with practical safeguards.', 'Meet in a public place, control your transportation, tell a trusted person the plan, keep communication options, and leave if something feels unsafe.', q('A safer first meeting is usually?', ['Public with independent transport', 'At an isolated location', 'Without telling anyone'], 0)),
      lesson('reporting', 'Block and Report', 'Use boundaries and reporting tools without confrontation.', 'Blocking ends unwanted contact. Reporting should preserve the reason and route serious threats or suspected exploitation to an appropriate safety process.', q('If someone pressures or threatens you, a sound action is?', ['Block and report', 'Share more private data', 'Promise payment'], 0)),
    ]
  },
];

export function gradeCourseQuestion(question: CourseQuestion, selectedIndex: number) {
  if (question.correctIndex < 0 || question.correctIndex >= question.choices.length) throw new Error('invalid answer key');
  return { correct: selectedIndex === question.correctIndex, selectedIndex, correctIndex: question.correctIndex };
}

export function courseById(id: string) {
  return gapCourses.find((course) => course.id === id);
}
