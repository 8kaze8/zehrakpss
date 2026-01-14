/**
 * ErrorBoundary Component
 * Beklenmedik hataları yakalar ve kullanıcı dostu bir hata mesajı gösterir
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Production'da error tracking servislere gönderilebilir (Sentry vb.)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <div className="mb-4">
              <span className="material-symbols-outlined text-5xl text-red-500">
                error_outline
              </span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-text-main dark:text-white">
              Bir Hata Oluştu
            </h2>
            <p className="mb-4 text-sm text-text-sub dark:text-slate-400">
              Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={this.handleRetry}
                icon="refresh"
              >
                Tekrar Dene
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={this.handleReload}
                icon="restart_alt"
              >
                Sayfayı Yenile
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional component wrapper for easier usage
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
