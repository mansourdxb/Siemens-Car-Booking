import React, { useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const name = data.email.split("@")[0].replace(/[._]/g, " ");
        const success = await register(data.email, name, "Dubai");
        if (!success) {
          setError("Registration failed. Please try again.");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        const success = await login(data.email, data.password);
        if (!success) {
          setError("Invalid email. Try admin@siemens.com or john.engineer@siemens.com");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="h1" style={styles.title}>
          Car Booking
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Siemens Mobility - Hafeet Project
        </ThemedText>
      </View>

      <View
        style={[
          styles.formCard,
          { backgroundColor: theme.surface },
          Shadows.lg,
        ]}
      >
        <ThemedText type="h3" style={styles.formTitle}>
          {isRegister ? "Create Account" : "Sign In"}
        </ThemedText>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="your.email@siemens.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="mail"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              leftIcon="lock"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.error + "15" }]}>
            <ThemedText style={[styles.errorText, { color: theme.error }]}>
              {error}
            </ThemedText>
          </View>
        ) : null}

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={styles.submitButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : isRegister ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </Button>

        <Pressable
          onPress={() => setIsRegister(!isRegister)}
          style={styles.toggleButton}
        >
          <ThemedText style={[styles.toggleText, { color: theme.textSecondary }]}>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <ThemedText style={{ color: theme.primary }}>
              {isRegister ? "Sign In" : "Register"}
            </ThemedText>
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.demoHint}>
        Demo: Use admin@siemens.com or john.engineer@siemens.com
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing["4xl"],
    marginBottom: Spacing["3xl"],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  formTitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  toggleButton: {
    marginTop: Spacing.xl,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
  },
  demoHint: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
