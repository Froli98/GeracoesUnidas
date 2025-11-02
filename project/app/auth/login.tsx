import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, session, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session && !loading) {
      if (profile) {
        console.log('Login: Session and profile detected, navigating to tabs');
        router.replace('/(tabs)');
      }
    }
  }, [session, profile, loading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor preencha todos os campos');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.primaryLight, theme.colors.accentWarm, '#FFFAF5']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Heart size={56} color={theme.colors.primary} fill={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Gerações Unidas</Text>
          <Text style={styles.subtitle}>
            Conectando idosos e estudantes
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Palavra-passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.linkText}>
              Não tem conta? Registe-se aqui
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.shadowStrong,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginTop: theme.spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.text,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    shadowColor: theme.colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  linkButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
