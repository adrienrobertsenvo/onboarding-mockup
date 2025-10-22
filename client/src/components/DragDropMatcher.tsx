import { useState, DragEvent } from 'react';

interface DragDropMatcherProps {
  accountNumbers: string[];
  contractFiles: File[];
  mappings: Record<string, string>;
  onMappingChange: (mappings: Record<string, string>) => void;
}

export default function DragDropMatcher({
  accountNumbers,
  contractFiles,
  mappings,
  onMappingChange
}: DragDropMatcherProps) {
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [hoverAccount, setHoverAccount] = useState<string | null>(null);

  const handleDragStart = (fileName: string) => {
    setDraggedFile(fileName);
  };

  const handleDragOver = (e: DragEvent, accountNumber: string) => {
    e.preventDefault();
    setHoverAccount(accountNumber);
  };

  const handleDragLeave = () => {
    setHoverAccount(null);
  };

  const handleDrop = (e: DragEvent, accountNumber: string) => {
    e.preventDefault();
    if (draggedFile) {
      // Allow many-to-one: multiple accounts can have the same contract
      const newMappings = { ...mappings, [accountNumber]: draggedFile };
      onMappingChange(newMappings);
    }
    setDraggedFile(null);
    setHoverAccount(null);
  };

  const handleRemoveMapping = (accountNumber: string) => {
    const newMappings = { ...mappings };
    delete newMappings[accountNumber];
    onMappingChange(newMappings);
  };

  // Get all accounts that use a specific contract
  const getAccountsForContract = (fileName: string): string[] => {
    return Object.entries(mappings)
      .filter(([_, contract]) => contract === fileName)
      .map(([account, _]) => account);
  };

  // Check if a contract is used by any account
  const isContractUsed = (fileName: string): boolean => {
    return getAccountsForContract(fileName).length > 0;
  };

  if (accountNumbers.length === 0 || contractFiles.length === 0) {
    return null;
  }

  return (
    <div style={{
      padding: '2rem',
      background: 'var(--gray-50)',
      borderRadius: '12px',
      border: '2px solid var(--gray-200)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-900)', fontSize: '1.125rem', fontWeight: 600 }}>
        Match Account Numbers and Contracts
      </h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        You can connect each contract to several account numbers, and vice versa.
        Drag and drop freely — it's flexible!
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Left Column - Account Numbers */}
        <div>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--gray-700)',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Account Numbers
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {accountNumbers.map((account) => (
              <div
                key={account}
                onDragOver={(e) => handleDragOver(e, account)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, account)}
                style={{
                  padding: '1rem',
                  background: hoverAccount === account ? 'rgba(37, 99, 235, 0.05)' : 'white',
                  border: `2px ${hoverAccount === account ? 'solid' : 'dashed'} ${
                    hoverAccount === account ? 'var(--primary)' : 'var(--gray-300)'
                  }`,
                  borderRadius: '8px',
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  fontWeight: 600,
                  color: 'var(--gray-900)',
                  marginBottom: mappings[account] ? '0.5rem' : 0
                }}>
                  {account}
                </div>
                {mappings[account] && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'var(--gray-50)',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: 'var(--success)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      ✓ {mappings[account]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMapping(account)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginLeft: '0.5rem',
                        flexShrink: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                {!mappings[account] && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--gray-500)',
                    fontStyle: 'italic'
                  }}>
                    Drop contract here
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Contract Files */}
        <div>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--gray-700)',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Contract Files
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {contractFiles.map((file) => {
              const accountsUsingThisContract = getAccountsForContract(file.name);
              const isUsed = accountsUsingThisContract.length > 0;

              return (
                <div
                  key={file.name}
                  draggable={true}
                  onDragStart={() => handleDragStart(file.name)}
                  onDragEnd={() => setDraggedFile(null)}
                  style={{
                    padding: '1rem',
                    background: 'white',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    cursor: 'grab',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--gray-900)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {file.name}
                      </div>
                    </div>
                    {isUsed && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'var(--success)',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        {accountsUsingThisContract.length}
                      </span>
                    )}
                  </div>

                  {isUsed && (
                    <div style={{
                      padding: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--success)'
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        ✓ Assigned to {accountsUsingThisContract.length} account{accountsUsingThisContract.length > 1 ? 's' : ''}:
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.25rem',
                        maxHeight: '60px',
                        overflow: 'auto'
                      }}>
                        {accountsUsingThisContract.map((account) => (
                          <span
                            key={account}
                            style={{
                              display: 'inline-block',
                              padding: '0.125rem 0.5rem',
                              background: 'white',
                              border: '1px solid var(--success)',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {account}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: Object.keys(mappings).length === accountNumbers.length
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(251, 191, 36, 0.1)',
        borderRadius: '8px',
        border: `2px solid ${
          Object.keys(mappings).length === accountNumbers.length
            ? 'var(--success)'
            : '#fbbf24'
        }`,
        textAlign: 'center',
        fontSize: '0.875rem'
      }}>
        {Object.keys(mappings).length === accountNumbers.length ? (
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>
            ✓ All accounts matched! ({Object.keys(mappings).length}/{accountNumbers.length})
          </span>
        ) : (
          <span style={{ color: '#92400e', fontWeight: 600 }}>
            {Object.keys(mappings).length}/{accountNumbers.length} accounts matched
          </span>
        )}
      </div>
    </div>
  );
}
