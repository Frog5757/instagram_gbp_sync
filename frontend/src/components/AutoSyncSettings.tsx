import { useState } from 'react';
import styled from '@emotion/styled';

interface AutoSyncSettingsProps {
  isAuthenticated: boolean;
}

interface SyncSettings {
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
  maxPosts: number;
  includeStories: boolean;
  includeReels: boolean;
}

const AutoSyncSettings = ({ isAuthenticated }: AutoSyncSettingsProps) => {
  const [settings, setSettings] = useState<SyncSettings>({
    enabled: false,
    frequency: 'hourly',
    maxPosts: 50,
    includeStories: false,
    includeReels: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSync = async () => {
    setIsUpdating(true);
    
    // TODO: APIコールでデータベースに設定を保存
    setTimeout(() => {
      setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
      setIsUpdating(false);
    }, 1000);
  };

  const handleSettingChange = (key: keyof SyncSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <DisabledContainer>
        <DisabledContent>
          <DisabledIcon>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </DisabledIcon>
          <DisabledTitle>自動同期設定</DisabledTitle>
          <DisabledDescription>
            Instagramと連携すると自動同期の設定ができます
          </DisabledDescription>
        </DisabledContent>
      </DisabledContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <HeaderContent>
          <div>
            <SettingsTitle>自動同期設定</SettingsTitle>
            <SettingsDescription>
              Instagram投稿の自動同期を設定します
            </SettingsDescription>
          </div>
          <ToggleSection>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.enabled}
                onChange={handleToggleSync}
                disabled={isUpdating}
              />
              <ToggleSlider enabled={settings.enabled} />
            </ToggleSwitch>
            {isUpdating && <UpdateSpinner />}
          </ToggleSection>
        </HeaderContent>
      </SettingsHeader>

      <SettingsContent disabled={!settings.enabled}>
        <SettingSection>
          <SectionLabel>同期頻度</SectionLabel>
          <FrequencyGrid>
            {[
              { value: 'realtime', label: 'リアルタイム', desc: '投稿と同時' },
              { value: 'hourly', label: '1時間ごと', desc: '定期チェック' },
              { value: 'daily', label: '1日1回', desc: '夜間バッチ' }
            ].map(option => (
              <FrequencyOption
                key={option.value}
                onClick={() => handleSettingChange('frequency', option.value)}
                disabled={!settings.enabled}
                selected={settings.frequency === option.value}
              >
                <OptionLabel>{option.label}</OptionLabel>
                <OptionDesc>{option.desc}</OptionDesc>
              </FrequencyOption>
            ))}
          </FrequencyGrid>
        </SettingSection>

        <SettingSection>
          <SectionLabel>1回の同期で取得する最大投稿数</SectionLabel>
          <SliderSection>
            <SliderInput
              type="range"
              min="10"
              max="100"
              step="10"
              value={settings.maxPosts}
              onChange={(e) => handleSettingChange('maxPosts', parseInt(e.target.value))}
              disabled={!settings.enabled}
            />
            <SliderValue>{settings.maxPosts}件</SliderValue>
          </SliderSection>
        </SettingSection>

        <SettingSection>
          <SectionLabel>同期するコンテンツ</SectionLabel>
          <CheckboxList>
            <CheckboxItem>
              <CheckboxInput type="checkbox" checked={true} disabled={true} />
              <CheckboxLabel>通常の投稿 (常に含まれます)</CheckboxLabel>
            </CheckboxItem>
            <CheckboxItem>
              <CheckboxInput
                type="checkbox"
                checked={settings.includeReels}
                onChange={(e) => handleSettingChange('includeReels', e.target.checked)}
                disabled={!settings.enabled}
              />
              <CheckboxLabel>リール</CheckboxLabel>
            </CheckboxItem>
            <CheckboxItem>
              <CheckboxInput
                type="checkbox"
                checked={settings.includeStories}
                onChange={(e) => handleSettingChange('includeStories', e.target.checked)}
                disabled={!settings.enabled}
              />
              <CheckboxLabel>ストーリー (24時間で削除)</CheckboxLabel>
            </CheckboxItem>
          </CheckboxList>
        </SettingSection>

        {settings.enabled && (
          <StatusSection>
            <StatusContent>
              <StatusIndicator />
              <div>
                <StatusTitle>自動同期が有効です</StatusTitle>
                <StatusText>
                  次回同期: {settings.frequency === 'realtime' ? 'リアルタイム' : 
                           settings.frequency === 'hourly' ? '1時間以内' : '明日の午前2時'}
                </StatusText>
              </div>
            </StatusContent>
          </StatusSection>
        )}
      </SettingsContent>
    </SettingsContainer>
  );
};

const DisabledContainer = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const DisabledContent = styled.div`
  text-align: center;
`;

const DisabledIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.75rem;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const DisabledTitle = styled.h3`
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
`;

const DisabledDescription = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
`;

const SettingsContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

const SettingsHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SettingsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const SettingsDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
`;

const ToggleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.div<{ enabled: boolean }>`
  width: 2.75rem;
  height: 1.5rem;
  background: ${props => props.enabled ? '#2563eb' : '#e5e7eb'};
  border-radius: 1rem;
  position: relative;
  transition: background 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '1.25rem' : '2px'};
    width: 1.25rem;
    height: 1.25rem;
    background: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

const UpdateSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SettingsContent = styled.div<{ disabled: boolean }>`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const SettingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const FrequencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

const FrequencyOption = styled.button<{ selected: boolean; disabled: boolean }>`
  padding: 0.75rem;
  text-align: left;
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 0.5rem;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  color: ${props => props.selected ? '#1d4ed8' : '#374151'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => !props.disabled ? '#d1d5db' : '#e5e7eb'};
  }
`;

const OptionLabel = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;

const OptionDesc = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const SliderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SliderInput = styled.input`
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    width: 1rem;
    height: 1rem;
    background: #2563eb;
    border-radius: 50%;
    appearance: none;
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 3rem;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
  margin-right: 0.75rem;
`;

const CheckboxLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const StatusSection = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const StatusContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const StatusIndicator = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background: #60a5fa;
  border-radius: 50%;
  margin-top: 0.25rem;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatusTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e40af;
  margin: 0;
`;

const StatusText = styled.p`
  color: #1d4ed8;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
`;

export default AutoSyncSettings;