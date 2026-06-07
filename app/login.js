import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const C = {
  bg:         '#1B5E2E',
  card:       '#F0FDF4',
  green900:   '#14532D',
  green700:   '#15803D',
  green500:   '#22C55E',
  green200:   '#BBF7D0',
  onPitch:    '#F0FDF4',
  onPitchSec: '#86EFAC',
  text:       '#0F172A',
  textSec:    '#374151',
  textMuted:  '#6B7280',
  border:     '#D1FAE5',
  error:      '#991B1B',
  errorBg:    '#FCE8E8',
};

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Bitte E-Mail und Passwort eingeben.'); return; }
    if (mode === 'register' && !username.trim()) { setError('Bitte einen Benutzernamen eingeben.'); return; }
    if (password.length < 6) { setError('Passwort muss mindestens 6 Zeichen lang sein.'); return; }

    setLoading(true);
    const err = mode === 'login'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, username.trim());
    setLoading(false);

    if (err) setError(err.message);
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.logoArea}>
          <View style={s.logoCircle}>
            <Ionicons name="football" size={40} color={C.green700} />
          </View>
          <Text style={s.appName}>Tippspiel</Text>
          <Text style={s.appSub}>WM 2026</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </Text>

          {mode === 'register' && (
            <View style={s.inputGroup}>
              <Text style={s.label}>Benutzername</Text>
              <TextInput
                style={s.input}
                value={username}
                onChangeText={setUsername}
                placeholder="z. B. MaxMustermann"
                placeholderTextColor={C.textMuted}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={s.inputGroup}>
            <Text style={s.label}>E-Mail</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="deine@email.com"
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Passwort</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mindestens 6 Zeichen"
              placeholderTextColor={C.textMuted}
              secureTextEntry
            />
          </View>

          {error ? (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle" size={14} color={C.error} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitBtnText}>
                  {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
                </Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={s.switchBtn}
            onPress={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
          >
            <Text style={s.switchText}>
              {mode === 'login'
                ? 'Noch kein Konto? Registrieren'
                : 'Bereits registriert? Anmelden'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  scroll:         { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 24 },

  logoArea:       { alignItems: 'center', gap: 8 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.card, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  appName:        { color: C.onPitch, fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  appSub:         { color: C.onPitchSec, fontSize: 15 },

  card: {
    backgroundColor: C.card, borderRadius: 20, padding: 24, gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  cardTitle:      { color: C.green900, fontSize: 20, fontWeight: '800', marginBottom: 4 },

  inputGroup:     { gap: 6 },
  label:          { color: C.textSec, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#F8FFF8', borderWidth: 1.5, borderColor: C.border,
    borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14,
    color: C.text, fontSize: 15,
  },

  errorBox: {
    flexDirection: 'row', gap: 7, alignItems: 'flex-start',
    backgroundColor: C.errorBg, borderRadius: 8, padding: 10,
  },
  errorText:      { color: C.error, fontSize: 13, flex: 1, lineHeight: 18 },

  submitBtn: {
    backgroundColor: C.green700, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },

  switchBtn:      { alignItems: 'center', paddingVertical: 4 },
  switchText:     { color: C.green700, fontSize: 13, fontWeight: '600' },
});
