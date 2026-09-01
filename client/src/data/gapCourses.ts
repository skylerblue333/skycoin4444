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
];

export function gradeCourseQuestion(question: CourseQuestion, selectedIndex: number) {
  if (question.correctIndex < 0 || question.correctIndex >= question.choices.length) throw new Error('invalid answer key');
  return { correct: selectedIndex === question.correctIndex, selectedIndex, correctIndex: question.correctIndex };
}

export function courseById(id: string) {
  return gapCourses.find((course) => course.id === id);
}
