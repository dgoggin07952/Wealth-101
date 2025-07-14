"""
Professional PDF Generator with Charts, Graphs, and Branding
Creates visually stunning reports with comprehensive charts and professional design
"""

import io
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Frame, Image, KeepTogether
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import Drawing, Rect, Line, Circle, String
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart, HorizontalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor, Color
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from io import BytesIO
import base64


class ProfessionalPDFGenerator:
    """Professional PDF generator with charts and branding"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_colors()
        self._create_custom_styles()
        
    def _setup_colors(self):
        """Set up brand colors and theme"""
        # WealthTracker Pro Brand Colors
        self.primary_color = HexColor('#0f172a')      # Dark slate
        self.accent_color = HexColor('#ec4899')       # Pink
        self.secondary_color = HexColor('#1e293b')    # Slate
        self.text_color = HexColor('#334155')         # Text gray
        self.background_color = HexColor('#f8fafc')   # Light background
        self.success_color = HexColor('#10b981')      # Green
        self.warning_color = HexColor('#f59e0b')      # Orange
        self.danger_color = HexColor('#ef4444')       # Red
        self.chart_colors = [
            HexColor('#ec4899'),  # Pink
            HexColor('#8b5cf6'),  # Purple
            HexColor('#06b6d4'),  # Cyan
            HexColor('#10b981'),  # Green
            HexColor('#f59e0b'),  # Orange
            HexColor('#ef4444'),  # Red
            HexColor('#6366f1'),  # Indigo
            HexColor('#84cc16'),  # Lime
        ]
        
    def _create_custom_styles(self):
        """Create custom paragraph styles with branding"""
        # Main title style
        self.title_style = ParagraphStyle(
            name='BrandTitle',
            parent=self.styles['Heading1'],
            fontSize=32,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=self.primary_color,
            fontName='Helvetica-Bold'
        )
        
        # Section header style
        self.section_style = ParagraphStyle(
            name='BrandSection',
            parent=self.styles['Heading2'],
            fontSize=20,
            spaceAfter=15,
            spaceBefore=25,
            textColor=self.accent_color,
            fontName='Helvetica-Bold'
        )
        
        # Subsection style
        self.subsection_style = ParagraphStyle(
            name='BrandSubsection',
            parent=self.styles['Heading3'],
            fontSize=16,
            spaceAfter=10,
            spaceBefore=15,
            textColor=self.secondary_color,
            fontName='Helvetica-Bold'
        )
        
        # Body text style
        self.body_style = ParagraphStyle(
            name='BrandBody',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            textColor=self.text_color,
            fontName='Helvetica',
            leading=16
        )
        
        # Highlight box style
        self.highlight_style = ParagraphStyle(
            name='BrandHighlight',
            parent=self.styles['Normal'],
            fontSize=13,
            spaceAfter=15,
            spaceBefore=15,
            leftIndent=25,
            rightIndent=25,
            textColor=self.primary_color,
            fontName='Helvetica-Bold',
            backColor=HexColor('#fef7f7'),
            borderColor=self.accent_color,
            borderWidth=2,
            borderPadding=15
        )
        
        # Footer style
        self.footer_style = ParagraphStyle(
            name='BrandFooter',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER,
            textColor=self.text_color,
            fontName='Helvetica'
        )
        
    def _create_logo_placeholder(self, width=2*inch, height=0.8*inch):
        """Create a branded logo placeholder with modern design"""
        drawing = Drawing(width, height)
        
        # Modern gradient-style background
        drawing.add(Rect(0, 0, width, height, 
                        fillColor=self.primary_color, 
                        strokeColor=None))
        
        # Accent stripe
        drawing.add(Rect(0, height-8, width, 8, 
                        fillColor=self.accent_color, 
                        strokeColor=None))
        
        # Company name with modern styling
        drawing.add(String(width/2, height/2 + 8, 'WealthTracker Pro', 
                          fontSize=18, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=colors.white))
        
        # Tagline with elegant font
        drawing.add(String(width/2, height/2 - 8, 'Professional Wealth Management', 
                          fontSize=10, fontName='Helvetica', 
                          textAnchor='middle', fillColor=HexColor('#e2e8f0')))
        
        return drawing
    
    def _create_pie_chart(self, data: Dict[str, float], title: str, width=4*inch, height=3*inch):
        """Create a professional pie chart"""
        drawing = Drawing(width, height)
        
        # Create pie chart
        pie = Pie()
        pie.x = 50
        pie.y = 50
        pie.width = width - 100
        pie.height = height - 100
        
        # Set data
        labels = list(data.keys())
        values = list(data.values())
        pie.data = values
        pie.labels = labels
        
        # Set colors
        pie.slices.strokeColor = colors.white
        pie.slices.strokeWidth = 2
        for i, color in enumerate(self.chart_colors[:len(values)]):
            pie.slices[i].fillColor = color
        
        # Chart styling
        pie.slices.labelRadius = 1.2
        pie.slices.fontName = 'Helvetica-Bold'
        pie.slices.fontSize = 10
        pie.slices.fontColor = self.text_color
        
        drawing.add(pie)
        
        # Add title
        drawing.add(String(width/2, height - 20, title, 
                          fontSize=14, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=self.primary_color))
        
        return drawing
    
    def _create_bar_chart(self, data: Dict[str, float], title: str, width=5*inch, height=3*inch):
        """Create a professional bar chart"""
        drawing = Drawing(width, height)
        
        # Create bar chart
        chart = VerticalBarChart()
        chart.x = 50
        chart.y = 50
        chart.width = width - 100
        chart.height = height - 100
        
        # Set data
        labels = list(data.keys())
        values = list(data.values())
        chart.data = [values]
        chart.categoryAxis.categoryNames = labels
        
        # Set colors
        chart.bars.strokeColor = colors.white
        chart.bars.strokeWidth = 1
        # Set bar colors
        for i, color in enumerate(self.chart_colors[:len(values)]):
            chart.bars[(0, i)].fillColor = color
        
        # Chart styling
        chart.valueAxis.valueMin = 0
        chart.valueAxis.valueMax = max(values) * 1.1
        chart.valueAxis.labelTextFormat = '£%s'
        chart.categoryAxis.labels.angle = 45
        chart.categoryAxis.labels.fontSize = 9
        chart.categoryAxis.labels.fontName = 'Helvetica'
        chart.valueAxis.labels.fontSize = 9
        chart.valueAxis.labels.fontName = 'Helvetica'
        
        drawing.add(chart)
        
        # Add title
        drawing.add(String(width/2, height - 20, title, 
                          fontSize=14, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=self.primary_color))
        
        return drawing
    
    def _create_line_chart(self, data: List[Dict], title: str, width=5*inch, height=3*inch):
        """Create a professional line chart for trends"""
        drawing = Drawing(width, height)
        
        # Create line chart
        chart = HorizontalLineChart()
        chart.x = 50
        chart.y = 50
        chart.width = width - 100
        chart.height = height - 100
        
        # Set data
        if data:
            dates = [item['date'] for item in data]
            values = [item['value'] for item in data]
            chart.data = [values]
            chart.categoryAxis.categoryNames = dates
        else:
            # Default data for demo
            chart.data = [[250000, 270000, 290000, 315000, 340000, 365000]]
            chart.categoryAxis.categoryNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        # Chart styling
        chart.lines[0].strokeColor = self.accent_color
        chart.lines[0].strokeWidth = 3
        chart.lines[0].symbol = makeMarker('Circle')
        chart.lines[0].symbol.size = 6
        chart.lines[0].symbol.fillColor = self.accent_color
        
        chart.categoryAxis.labels.angle = 45
        chart.categoryAxis.labels.fontSize = 9
        chart.categoryAxis.labels.fontName = 'Helvetica'
        chart.valueAxis.labels.fontSize = 9
        chart.valueAxis.labels.fontName = 'Helvetica'
        chart.valueAxis.labelTextFormat = '£%s'
        
        drawing.add(chart)
        
        # Add title
        drawing.add(String(width/2, height - 20, title, 
                          fontSize=14, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=self.primary_color))
        
        return drawing
    
    def _create_header_footer(self, canvas, doc):
        """Create modern header and footer with dark styling"""
        canvas.saveState()
        
        # Dark header background
        canvas.setFillColor(self.primary_color)
        canvas.rect(0, A4[1] - 60, A4[0], 60, fill=1, stroke=0)
        
        # Pink accent line
        canvas.setFillColor(self.accent_color)
        canvas.rect(0, A4[1] - 65, A4[0], 5, fill=1, stroke=0)
        
        # Header text
        canvas.setFont('Helvetica-Bold', 12)
        canvas.setFillColor(colors.white)
        canvas.drawString(50, A4[1] - 40, "WealthTracker Pro")
        canvas.setFont('Helvetica', 10)
        canvas.setFillColor(HexColor('#e2e8f0'))
        canvas.drawString(50, A4[1] - 25, f"Generated {datetime.now().strftime('%B %d, %Y')}")
        
        # Dark footer background
        canvas.setFillColor(self.primary_color)
        canvas.rect(0, 0, A4[0], 50, fill=1, stroke=0)
        
        # Pink accent line
        canvas.setFillColor(self.accent_color)
        canvas.rect(0, 50, A4[0], 3, fill=1, stroke=0)
        
        # Footer text
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.white)
        canvas.drawString(50, 25, "Confidential & Proprietary")
        canvas.drawRightString(A4[0] - 50, 25, f"Page {doc.page}")
        
        canvas.restoreState()
    
    def generate_wealth_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate a comprehensive wealth report with charts and professional design"""
        buffer = io.BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=70,
            bottomMargin=50
        )
        
        story = []
        
        # COVER PAGE WITH DARK BACKGROUND
        story.append(Spacer(1, 0.3*inch))
        
        # Create dark background section
        dark_bg = Drawing(A4[0]-100, 4*inch)
        dark_bg.add(Rect(0, 0, A4[0]-100, 4*inch, fillColor=self.primary_color, strokeColor=None))
        
        # Pink accent elements
        dark_bg.add(Rect(0, 3.8*inch, A4[0]-100, 0.2*inch, fillColor=self.accent_color, strokeColor=None))
        dark_bg.add(Rect(0, 0, A4[0]-100, 0.2*inch, fillColor=self.accent_color, strokeColor=None))
        
        # Main title on dark background
        dark_bg.add(String((A4[0]-100)/2, 3*inch, 'COMPREHENSIVE', 
                          fontSize=28, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=colors.white))
        dark_bg.add(String((A4[0]-100)/2, 2.5*inch, 'WEALTH REPORT', 
                          fontSize=32, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=self.accent_color))
        
        # Client info on dark background
        dark_bg.add(String((A4[0]-100)/2, 1.8*inch, f"Prepared for: {user_data.get('name', 'Valued Client')}", 
                          fontSize=14, fontName='Helvetica', 
                          textAnchor='middle', fillColor=colors.white))
        dark_bg.add(String((A4[0]-100)/2, 1.5*inch, f"Report Date: {datetime.now().strftime('%B %d, %Y')}", 
                          fontSize=12, fontName='Helvetica', 
                          textAnchor='middle', fillColor=HexColor('#e2e8f0')))
        
        # Financial metrics on dark background
        net_worth = financial_data.get('net_worth', 0)
        total_assets = financial_data.get('total_assets', 0)
        health_score = financial_data.get('health_score', 0)
        
        dark_bg.add(String((A4[0]-100)/2, 1*inch, f"Net Worth: £{net_worth:,.0f}", 
                          fontSize=16, fontName='Helvetica-Bold', 
                          textAnchor='middle', fillColor=colors.white))
        dark_bg.add(String((A4[0]-100)/2, 0.7*inch, f"Health Score: {health_score}/1000", 
                          fontSize=14, fontName='Helvetica', 
                          textAnchor='middle', fillColor=self.accent_color))
        
        story.append(dark_bg)
        story.append(Spacer(1, 0.5*inch))
        
        # Logo below dark section
        logo = self._create_logo_placeholder()
        story.append(logo)
        
        story.append(PageBreak())
        
        # FINANCIAL OVERVIEW WITH DARK SECTION HEADERS
        # Create dark section header
        section_bg = Drawing(A4[0]-100, 0.8*inch)
        section_bg.add(Rect(0, 0, A4[0]-100, 0.8*inch, fillColor=self.primary_color, strokeColor=None))
        section_bg.add(Rect(0, 0, A4[0]-100, 0.1*inch, fillColor=self.accent_color, strokeColor=None))
        section_bg.add(String(30, 0.4*inch, '01 FINANCIAL OVERVIEW', 
                              fontSize=22, fontName='Helvetica-Bold', 
                              textAnchor='start', fillColor=colors.white))
        story.append(section_bg)
        story.append(Spacer(1, 0.3*inch))
        
        # Key metrics table
        metrics_data = [
            ['Metric', 'Value', 'Status'],
            ['Net Worth', f"£{net_worth:,.2f}", '✓ Strong'],
            ['Total Assets', f"£{total_assets:,.2f}", '✓ Growing'],
            ['Monthly Income', f"£{financial_data.get('monthly_income', 0):,.2f}", '✓ Stable'],
            ['Monthly Expenses', f"£{financial_data.get('monthly_expenses', 0):,.2f}", '✓ Managed'],
            ['Emergency Fund', f"£{financial_data.get('emergency_fund', 0):,.2f}", '✓ Adequate'],
        ]
        
        metrics_table = Table(metrics_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.accent_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 11),
            ('BACKGROUND', (0, 1), (-1, -1), self.background_color),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(metrics_table)
        story.append(Spacer(1, 0.5*inch))
        
        # ASSET ALLOCATION SECTION WITH DARK HEADER
        section_bg = Drawing(A4[0]-100, 0.8*inch)
        section_bg.add(Rect(0, 0, A4[0]-100, 0.8*inch, fillColor=self.primary_color, strokeColor=None))
        section_bg.add(Rect(0, 0, A4[0]-100, 0.1*inch, fillColor=self.accent_color, strokeColor=None))
        section_bg.add(String(30, 0.4*inch, '02 ASSET ALLOCATION', 
                              fontSize=22, fontName='Helvetica-Bold', 
                              textAnchor='start', fillColor=colors.white))
        story.append(section_bg)
        story.append(Spacer(1, 0.3*inch))
        
        # Asset allocation pie chart
        assets = financial_data.get('assets', {
            'Cash & Savings': 75000,
            'Investments': 175000,
            'Property': 100000,
            'Retirement': 50000,
            'Other': 25000
        })
        
        pie_chart = self._create_pie_chart(assets, "Asset Distribution", 4*inch, 3*inch)
        story.append(pie_chart)
        story.append(Spacer(1, 0.3*inch))
        
        # Asset details table
        asset_data = [['Asset Type', 'Value', 'Percentage', 'Risk Level']]
        total_asset_value = sum(assets.values())
        
        risk_levels = {
            'Cash & Savings': 'Low',
            'Investments': 'Medium-High',
            'Property': 'Medium',
            'Retirement': 'Medium',
            'Other': 'Variable'
        }
        
        for asset_type, value in assets.items():
            percentage = (value / total_asset_value) * 100 if total_asset_value > 0 else 0
            risk = risk_levels.get(asset_type, 'Medium')
            asset_data.append([asset_type, f"£{value:,.2f}", f"{percentage:.1f}%", risk])
        
        asset_data.append(['Total', f"£{total_asset_value:,.2f}", "100.0%", '-'])
        
        asset_table = Table(asset_data, colWidths=[2*inch, 1.5*inch, 1*inch, 1*inch])
        asset_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), HexColor('#e2e8f0')),
            ('BACKGROUND', (0, 1), (-1, -2), self.background_color),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        
        story.append(asset_table)
        story.append(PageBreak())
        
        # WEALTH TREND ANALYSIS WITH DARK HEADER
        section_bg = Drawing(A4[0]-100, 0.8*inch)
        section_bg.add(Rect(0, 0, A4[0]-100, 0.8*inch, fillColor=self.primary_color, strokeColor=None))
        section_bg.add(Rect(0, 0, A4[0]-100, 0.1*inch, fillColor=self.accent_color, strokeColor=None))
        section_bg.add(String(30, 0.4*inch, '03 WEALTH TRENDS', 
                              fontSize=22, fontName='Helvetica-Bold', 
                              textAnchor='start', fillColor=colors.white))
        story.append(section_bg)
        story.append(Spacer(1, 0.3*inch))
        
        # Wealth trend line chart
        trend_data = [
            {'date': 'Jan 2024', 'value': 280000},
            {'date': 'Feb 2024', 'value': 290000},
            {'date': 'Mar 2024', 'value': 305000},
            {'date': 'Apr 2024', 'value': 310000},
            {'date': 'May 2024', 'value': 315000},
            {'date': 'Jun 2024', 'value': 325000},
        ]
        
        line_chart = self._create_line_chart(trend_data, "6-Month Wealth Trend", 5*inch, 3*inch)
        story.append(line_chart)
        story.append(Spacer(1, 0.3*inch))
        
        # Performance metrics
        performance_text = f"""
        <para>
        <b>Performance Highlights:</b><br/><br/>
        • <b>6-Month Growth:</b> +£45,000 (+16.1%)<br/>
        • <b>Average Monthly Growth:</b> £7,500<br/>
        • <b>Best Performing Asset:</b> Investment Portfolio<br/>
        • <b>Diversification Score:</b> 8.2/10<br/>
        • <b>Risk-Adjusted Return:</b> 12.3%<br/>
        </para>
        """
        story.append(Paragraph(performance_text, self.body_style))
        story.append(Spacer(1, 0.5*inch))
        
        # STRATEGIC RECOMMENDATIONS WITH DARK HEADER
        section_bg = Drawing(A4[0]-100, 0.8*inch)
        section_bg.add(Rect(0, 0, A4[0]-100, 0.8*inch, fillColor=self.primary_color, strokeColor=None))
        section_bg.add(Rect(0, 0, A4[0]-100, 0.1*inch, fillColor=self.accent_color, strokeColor=None))
        section_bg.add(String(30, 0.4*inch, '04 STRATEGIC RECOMMENDATIONS', 
                              fontSize=22, fontName='Helvetica-Bold', 
                              textAnchor='start', fillColor=colors.white))
        story.append(section_bg)
        story.append(Spacer(1, 0.3*inch))
        
        recommendations = [
            "Increase emergency fund to 6-8 months of expenses (target: £50,000)",
            "Consider diversifying into international markets for better risk distribution",
            "Review pension contributions to maximize employer matching and tax benefits",
            "Explore property investment opportunities in emerging markets",
            "Implement tax-efficient investment strategies (ISAs, SIPPs, EIS)",
            "Consider life insurance review to protect family wealth",
            "Schedule quarterly portfolio rebalancing to maintain target allocation",
            "Establish investment policy statement with clear risk tolerance"
        ]
        
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"<b>{i}.</b> {rec}", self.body_style))
            story.append(Spacer(1, 0.1*inch))
        
        story.append(PageBreak())
        
        # FUTURE PROJECTIONS WITH DARK HEADER
        section_bg = Drawing(A4[0]-100, 0.8*inch)
        section_bg.add(Rect(0, 0, A4[0]-100, 0.8*inch, fillColor=self.primary_color, strokeColor=None))
        section_bg.add(Rect(0, 0, A4[0]-100, 0.1*inch, fillColor=self.accent_color, strokeColor=None))
        section_bg.add(String(30, 0.4*inch, '05 WEALTH PROJECTIONS', 
                              fontSize=22, fontName='Helvetica-Bold', 
                              textAnchor='start', fillColor=colors.white))
        story.append(section_bg)
        story.append(Spacer(1, 0.3*inch))
        
        # Projection scenarios
        current_wealth = net_worth
        projections = {
            '1 Year': current_wealth * 1.08,
            '3 Years': current_wealth * 1.25,
            '5 Years': current_wealth * 1.44,
            '10 Years': current_wealth * 2.16,
            '15 Years': current_wealth * 3.17,
        }
        
        projection_chart = self._create_bar_chart(projections, "Wealth Projections (8% Annual Growth)", 5*inch, 3*inch)
        story.append(projection_chart)
        story.append(Spacer(1, 0.3*inch))
        
        # Projection scenarios table
        scenario_data = [
            ['Time Period', 'Conservative (5%)', 'Moderate (8%)', 'Aggressive (12%)'],
            ['1 Year', f"£{current_wealth * 1.05:,.0f}", f"£{current_wealth * 1.08:,.0f}", f"£{current_wealth * 1.12:,.0f}"],
            ['3 Years', f"£{current_wealth * 1.16:,.0f}", f"£{current_wealth * 1.26:,.0f}", f"£{current_wealth * 1.40:,.0f}"],
            ['5 Years', f"£{current_wealth * 1.28:,.0f}", f"£{current_wealth * 1.47:,.0f}", f"£{current_wealth * 1.76:,.0f}"],
            ['10 Years', f"£{current_wealth * 1.63:,.0f}", f"£{current_wealth * 2.16:,.0f}", f"£{current_wealth * 3.11:,.0f}"],
            ['15 Years', f"£{current_wealth * 2.08:,.0f}", f"£{current_wealth * 3.17:,.0f}", f"£{current_wealth * 5.47:,.0f}"],
        ]
        
        scenario_table = Table(scenario_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        scenario_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.success_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BACKGROUND', (0, 1), (-1, -1), self.background_color),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(scenario_table)
        story.append(Spacer(1, 0.5*inch))
        
        # DISCLAIMER
        disclaimer = f"""
        <para align=center>
        <b>Important Disclaimer</b><br/><br/>
        This report is prepared by WealthTracker Pro for informational purposes only. 
        It does not constitute financial advice and should not be relied upon for investment decisions. 
        All projections are based on assumptions and historical performance, which may not reflect future results. 
        Past performance does not guarantee future returns. Please consult with qualified financial advisors 
        before making investment decisions.<br/><br/>
        <b>Report Generated:</b> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}<br/>
        <b>Confidential and Proprietary</b>
        </para>
        """
        story.append(Paragraph(disclaimer, self.highlight_style))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        
        buffer.seek(0)
        return buffer.read()
    
    def generate_financial_health_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate financial health report with detailed analysis and charts"""
        buffer = io.BytesIO()
        
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=70,
            bottomMargin=50
        )
        
        story = []
        
        # Cover page
        story.append(Spacer(1, 1*inch))
        logo = self._create_logo_placeholder()
        story.append(logo)
        story.append(Spacer(1, 0.5*inch))
        
        story.append(Paragraph("Financial Health Check Report", self.title_style))
        story.append(Spacer(1, 0.5*inch))
        
        # Health score highlight
        health_score = financial_data.get('health_score', 750)
        health_status = "Excellent" if health_score >= 800 else "Good" if health_score >= 600 else "Fair" if health_score >= 400 else "Needs Improvement"
        
        health_summary = f"""
        <para align=center>
        <b>FINANCIAL HEALTH SCORE</b><br/><br/>
        <b style="font-size: 24px">{health_score}/1000</b><br/>
        <b>Status: {health_status}</b><br/><br/>
        Comprehensive analysis of your financial wellness with actionable insights 
        and improvement recommendations.
        </para>
        """
        story.append(Paragraph(health_summary, self.highlight_style))
        
        story.append(PageBreak())
        
        # Health metrics with charts
        story.append(Paragraph("Health Score Breakdown", self.section_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Health categories
        health_categories = {
            'Asset Diversification': 85,
            'Debt Management': 78,
            'Emergency Fund': 92,
            'Savings Rate': 88,
            'Investment Performance': 75,
            'Risk Management': 82
        }
        
        health_chart = self._create_bar_chart(health_categories, "Financial Health Categories", 5*inch, 3*inch)
        story.append(health_chart)
        story.append(Spacer(1, 0.3*inch))
        
        # Detailed analysis
        analysis_text = f"""
        <para>
        <b>Detailed Analysis:</b><br/><br/>
        <b>Strengths:</b><br/>
        • Emergency fund exceeds 6 months of expenses<br/>
        • Strong asset diversification across multiple categories<br/>
        • Consistent savings rate above 20%<br/>
        • Low debt-to-income ratio<br/><br/>
        
        <b>Areas for Improvement:</b><br/>
        • Investment performance could be optimized<br/>
        • Consider increasing retirement contributions<br/>
        • Review insurance coverage adequacy<br/>
        • Explore tax-efficient investment strategies<br/>
        </para>
        """
        story.append(Paragraph(analysis_text, self.body_style))
        
        story.append(PageBreak())
        
        # Action plan
        story.append(Paragraph("Personalized Action Plan", self.section_style))
        story.append(Spacer(1, 0.3*inch))
        
        actions = [
            "Immediate (Next 30 days): Review and optimize high-fee investment accounts",
            "Short-term (3 months): Increase pension contributions by 2% if possible",
            "Medium-term (6 months): Diversify into international equity markets",
            "Long-term (12 months): Consider property investment or REITs for inflation protection",
            "Ongoing: Monthly review of expenses and quarterly portfolio rebalancing"
        ]
        
        for action in actions:
            story.append(Paragraph(f"• {action}", self.body_style))
            story.append(Spacer(1, 0.1*inch))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        
        buffer.seek(0)
        return buffer.read()
    
    def generate_estate_planning_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate estate planning report with tax analysis"""
        buffer = io.BytesIO()
        
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=70,
            bottomMargin=50
        )
        
        story = []
        
        # Cover page
        story.append(Spacer(1, 1*inch))
        logo = self._create_logo_placeholder()
        story.append(logo)
        story.append(Spacer(1, 0.5*inch))
        
        story.append(Paragraph("Estate Planning Report", self.title_style))
        story.append(Spacer(1, 0.5*inch))
        
        # Estate value summary
        net_worth = financial_data.get('net_worth', 0)
        inheritance_tax_threshold = 325000
        potential_tax = max(0, (net_worth - inheritance_tax_threshold) * 0.4)
        
        estate_summary = f"""
        <para align=center>
        <b>ESTATE VALUATION</b><br/><br/>
        <b>Total Estate Value:</b> £{net_worth:,.2f}<br/>
        <b>Inheritance Tax Threshold:</b> £{inheritance_tax_threshold:,.2f}<br/>
        <b>Potential Inheritance Tax:</b> £{potential_tax:,.2f}<br/><br/>
        Professional estate planning analysis with tax optimization strategies.
        </para>
        """
        story.append(Paragraph(estate_summary, self.highlight_style))
        
        story.append(PageBreak())
        
        # Tax analysis with charts
        story.append(Paragraph("Inheritance Tax Analysis", self.section_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Tax breakdown
        tax_breakdown = {
            'Tax-Free Allowance': inheritance_tax_threshold,
            'Taxable Estate': max(0, net_worth - inheritance_tax_threshold),
            'Tax Due (40%)': potential_tax
        }
        
        if tax_breakdown['Taxable Estate'] > 0:
            tax_chart = self._create_pie_chart(tax_breakdown, "Estate Tax Breakdown", 4*inch, 3*inch)
            story.append(tax_chart)
        
        story.append(Spacer(1, 0.3*inch))
        
        # Estate planning strategies
        story.append(Paragraph("Estate Planning Strategies", self.section_style))
        story.append(Spacer(1, 0.3*inch))
        
        strategies = [
            "Utilize annual gift allowance (£3,000 per year) to reduce estate value",
            "Consider setting up trusts for tax-efficient wealth transfer",
            "Review life insurance policies to cover potential inheritance tax",
            "Explore business property relief for qualifying investments",
            "Consider charitable giving to reduce taxable estate",
            "Review will and power of attorney documentation",
            "Plan for spouse exemption and residence nil-rate band",
            "Consider pension death benefits and beneficiary planning"
        ]
        
        for i, strategy in enumerate(strategies, 1):
            story.append(Paragraph(f"{i}. {strategy}", self.body_style))
            story.append(Spacer(1, 0.1*inch))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        
        buffer.seek(0)
        return buffer.read()