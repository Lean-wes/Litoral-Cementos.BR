// Sistema de gráficos para Ferretería Litoral
class ChartManager {
    constructor() {
        this.colors = {
            primary: '#2563eb',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            gray: '#64748b'
        };
    }

    drawBarChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        // Configuración por defecto
        const config = {
            padding: 40,
            barColor: this.colors.primary,
            textColor: '#1e293b',
            gridColor: '#e2e8f0',
            showValues: true,
            showGrid: true,
            ...options
        };

        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);

        if (!data || data.length === 0 || data.every(d => d.value === 0)) {
            this.drawNoDataMessage(ctx, width, height, 'No hay datos para mostrar');
            return;
        }

        const chartWidth = width - config.padding * 2;
        const chartHeight = height - config.padding * 2;
        const maxValue = Math.max(...data.map(d => d.value));

        // Dibujar grid
        if (config.showGrid) {
            this.drawGrid(ctx, config.padding, chartWidth, chartHeight, config.gridColor);
        }

        // Calcular dimensiones de barras
        const barWidth = chartWidth / data.length * 0.7;
        const barSpacing = chartWidth / data.length * 0.3;

        // Dibujar barras
        data.forEach((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const x = config.padding + (index * (barWidth + barSpacing)) + barSpacing / 2;
            const y = height - config.padding - barHeight;

            // Barra con gradiente
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, config.barColor);
            gradient.addColorStop(1, this.adjustColor(config.barColor, -20));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Borde de la barra
            ctx.strokeStyle = this.adjustColor(config.barColor, -30);
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, barHeight);

            // Etiqueta del eje X
            ctx.fillStyle = config.textColor;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            const labelText = item.label.length > 8 ? item.label.substring(0, 6) + '..' : item.label;
            ctx.fillText(labelText, x + barWidth / 2, height - config.padding + 20);

            // Valor encima de la barra
            if (config.showValues && item.value > 0) {
                ctx.fillStyle = config.textColor;
                ctx.font = 'bold 11px sans-serif';
                const valueText = typeof item.value === 'number' && item.value > 1000 ? 
                    `$${(item.value / 1000).toFixed(1)}k` : 
                    `$${item.value.toLocaleString()}`;
                ctx.fillText(valueText, x + barWidth / 2, y - 8);
            }
        });

        // Dibujar ejes
        this.drawAxes(ctx, config.padding, width, height, config.gridColor);
    }

    drawLineChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        const config = {
            padding: 40,
            lineColor: this.colors.primary,
            pointColor: this.colors.primary,
            fillColor: this.colors.primary + '20',
            textColor: '#1e293b',
            gridColor: '#e2e8f0',
            lineWidth: 3,
            pointRadius: 4,
            showFill: true,
            showPoints: true,
            ...options
        };

        ctx.clearRect(0, 0, width, height);

        if (!data || data.length === 0) {
            this.drawNoDataMessage(ctx, width, height, 'No hay datos para mostrar');
            return;
        }

        const chartWidth = width - config.padding * 2;
        const chartHeight = height - config.padding * 2;
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const valueRange = maxValue - minValue || 1;

        // Dibujar grid
        this.drawGrid(ctx, config.padding, chartWidth, chartHeight, config.gridColor);

        // Calcular puntos
        const points = data.map((item, index) => ({
            x: config.padding + (index / (data.length - 1)) * chartWidth,
            y: height - config.padding - ((item.value - minValue) / valueRange) * chartHeight,
            value: item.value,
            label: item.label
        }));

        // Área de relleno
        if (config.showFill) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, height - config.padding);
            points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.lineTo(points[points.length - 1].x, height - config.padding);
            ctx.closePath();
            ctx.fillStyle = config.fillColor;
            ctx.fill();
        }

        // Línea principal
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();

        // Puntos
        if (config.showPoints) {
            points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, config.pointRadius, 0, Math.PI * 2);
                ctx.fillStyle = config.pointColor;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }

        // Etiquetas del eje X
        ctx.fillStyle = config.textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        points.forEach(point => {
            const labelText = point.label.length > 8 ? point.label.substring(0, 6) + '..' : point.label;
            ctx.fillText(labelText, point.x, height - config.padding + 20);
        });

        // Dibujar ejes
        this.drawAxes(ctx, config.padding, width, height, config.gridColor);
    }

    drawPieChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        const config = {
            colors: [this.colors.primary, this.colors.success, this.colors.warning, this.colors.danger, '#8b5cf6', '#06b6d4'],
            textColor: '#1e293b',
            showLabels: true,
            showPercentages: true,
            ...options
        };

        ctx.clearRect(0, 0, width, height);

        if (!data || data.length === 0) {
            this.drawNoDataMessage(ctx, width, height, 'No hay datos para mostrar');
            return;
        }

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        if (total === 0) {
            this.drawNoDataMessage(ctx, width, height, 'No hay datos para mostrar');
            return;
        }

        let currentAngle = -Math.PI / 2; // Empezar desde arriba

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * Math.PI * 2;
            const color = config.colors[index % config.colors.length];

            // Dibujar sector
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Etiquetas
            if (config.showLabels) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                
                if (config.showPercentages) {
                    const percentage = Math.round((item.value / total) * 100);
                    ctx.fillText(`${percentage}%`, labelX, labelY);
                }
            }

            currentAngle += sliceAngle;
        });

        // Leyenda
        this.drawLegend(ctx, data, config.colors, width, height);
    }

    drawGrid(ctx, padding, chartWidth, chartHeight, gridColor) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        // Líneas horizontales
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Líneas verticales
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
    }

    drawAxes(ctx, padding, width, height, gridColor) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
    }

    drawNoDataMessage(ctx, width, height, message) {
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(message, width / 2, height / 2);
    }

    drawLegend(ctx, data, colors, width, height) {
        const legendX = 20;
        const legendY = height - 80;
        const itemHeight = 20;

        data.forEach((item, index) => {
            const y = legendY + index * itemHeight;
            const color = colors[index % colors.length];

            // Cuadrado de color
            ctx.fillStyle = color;
            ctx.fillRect(legendX, y, 15, 15);

            // Texto
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            const text = item.label.length > 20 ? item.label.substring(0, 18) + '..' : item.label;
            ctx.fillText(text, legendX + 20, y + 12);
        });
    }

    adjustColor(hex, percent) {
        // Convertir hex a RGB
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Animaciones
    animateChart(canvas, drawFunction, data, options = {}) {
        const duration = options.duration || 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Aplicar easing
            const easeProgress = this.easeOutCubic(progress);
            
            // Animar datos
            const animatedData = data.map(item => ({
                ...item,
                value: item.value * easeProgress
            }));
            
            drawFunction(canvas, animatedData, options);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Instancia global del gestor de gráficos
window.chartManager = new ChartManager();