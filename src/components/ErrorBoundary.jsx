"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-main p-6">
                <div className="text-center max-w-md">
                    <p className="text-4xl mb-4">⚠️</p>
                    <h2 className="text-text-primary font-bold text-lg mb-2">
                        Algo deu errado
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        Um erro inesperado ocorreu nesta página.
                    </p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-5 py-2 rounded-xl bg-brand-500 text-black font-semibold text-sm hover:brightness-110 transition-all"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }
}