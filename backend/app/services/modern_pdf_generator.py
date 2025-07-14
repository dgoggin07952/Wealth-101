"""
Modern PDF Report Generator with Enhanced Design and Content
Professional layouts with charts, tables, and modern styling
"""
from io import BytesIO
from datetime import datetime, date
from typing import Dict, List, Optional, Any
import base64

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Frame, Image, KeepTogether
)
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import Drawing, Rect, Line
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics import renderPDF

class ModernPDFGenerator:
    """Modern PDF generator with enhanced styling and content"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._create_custom_styles()
        self.primary_color = colors.HexColor('#ec4899')  # Pink
        self.secondary_color = colors.HexColor('#0f172a')  # Dark blue
        self.accent_color = colors.HexColor('#1e293b')  # Medium blue
        self.text_color = colors.HexColor('#334155')  # Gray
        self.success_color = colors.HexColor('#10b981')  # Green
        self.warning_color = colors.HexColor('#f59e0b')  # Orange
        self.danger_color = colors.HexColor('#ef4444')  # Red
        
    def _create_custom_styles(self):
        """Create custom paragraph styles"""
        # Create custom styles with unique names
        self.custom_title = ParagraphStyle(
            name='WealthTrackerTitle',
            parent=self.styles['Heading1'],
            fontSize=28,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#0f172a'),
            fontName='Helvetica-Bold'
        )
        
        self.section_header = ParagraphStyle(
            name='WealthTrackerSectionHeader',
            parent=self.styles['Heading2'],
            fontSize=18,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.HexColor('#ec4899'),
            fontName='Helvetica-Bold'
        )
        
        self.subsection_header = ParagraphStyle(
            name='WealthTrackerSubsectionHeader',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=12,
            textColor=colors.HexColor('#1e293b'),
            fontName='Helvetica-Bold'
        )
        
        self.body_text = ParagraphStyle(
            name='WealthTrackerBodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor('#334155'),
            fontName='Helvetica'
        )
        
        self.highlight_box = ParagraphStyle(
            name='WealthTrackerHighlightBox',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12,
            spaceBefore=12,
            leftIndent=20,
            rightIndent=20,
            textColor=colors.HexColor('#0f172a'),
            fontName='Helvetica-Bold',
            backColor=colors.HexColor('#fef3f2')
        )
        
    def _create_header_footer(self, canvas, doc):
        """Create professional header and footer"""
        canvas.saveState()
        
        # Header
        canvas.setFont('Helvetica-Bold', 16)
        canvas.setFillColor(self.primary_color)
        canvas.drawString(50, A4[1] - 50, "WealthTracker Pro")
        
        # Header line
        canvas.setStrokeColor(self.primary_color)
        canvas.setLineWidth(2)
        canvas.line(50, A4[1] - 60, A4[0] - 50, A4[1] - 60)
        
        # Footer
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(self.text_color)
        canvas.drawString(50, 50, f"Generated on {datetime.now().strftime('%B %d, %Y')}")
        canvas.drawRightString(A4[0] - 50, 50, f"Page {doc.page}")
        
        # Footer line
        canvas.setStrokeColor(self.text_color)
        canvas.setLineWidth(0.5)
        canvas.line(50, 60, A4[0] - 50, 60)
        
        canvas.restoreState()
        
    def _create_summary_card(self, title: str, value: str, subtitle: str = "", color=None):
        """Create a styled summary card"""
        if color is None:
            color = self.primary_color
            
        data = [
            [title],
            [value],
            [subtitle] if subtitle else [""]
        ]
        
        table = Table(data, colWidths=[4*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, 1), 24),
            ('FONTNAME', (0, 2), (-1, 2), 'Helvetica'),
            ('FONTSIZE', (0, 2), (-1, 2), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#0f172a')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, color),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f8fafc'), colors.HexColor('#ffffff')]),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        return table
        
    def _create_pie_chart(self, data: Dict[str, float], title: str, width=4*inch, height=3*inch):
        """Create a modern pie chart"""
        drawing = Drawing(width, height)
        
        # Create pie chart
        pie = Pie()
        pie.x = 50
        pie.y = 50
        pie.width = width - 100
        pie.height = height - 100
        
        # Data
        labels = list(data.keys())
        values = list(data.values())
        
        pie.data = values
        pie.labels = labels
        
        # Colors
        colors_list = [
            colors.HexColor('#ec4899'),  # Pink
            colors.HexColor('#3b82f6'),  # Blue
            colors.HexColor('#10b981'),  # Green
            colors.HexColor('#f59e0b'),  # Orange
            colors.HexColor('#8b5cf6'),  # Purple
            colors.HexColor('#06b6d4'),  # Cyan
            colors.HexColor('#ef4444'),  # Red
            colors.HexColor('#64748b'),  # Gray
        ]
        
        pie.slices.strokeColor = colors.white
        pie.slices.strokeWidth = 2
        
        for i, color in enumerate(colors_list[:len(values)]):
            pie.slices[i].fillColor = color
            
        drawing.add(pie)
        
        # Add title
        drawing.add(Paragraph(title, self.section_header))
        
        return drawing
        
    def generate_wealth_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate comprehensive wealth report"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=80,
            bottomMargin=80
        )
        
        story = []
        
        # Title Page
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("Wealth Management Report", self.custom_title))
        story.append(Spacer(1, 0.5*inch))
        
        # Client info box
        client_info = f"""
        <para align=center>
        <b>Prepared for:</b> {user_data.get('name', 'Valued Client')}<br/>
        <b>Report Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
        <b>Reporting Period:</b> {datetime.now().strftime('%Y')}<br/>
        </para>
        """
        story.append(Paragraph(client_info, self.body_text))
        story.append(Spacer(1, 1*inch))
        
        # Executive Summary Box
        summary_text = """
        <para align=center>
        <b>EXECUTIVE SUMMARY</b><br/>
        This comprehensive wealth report provides a detailed analysis of your financial position,
        including asset allocation, growth trends, and strategic recommendations for wealth optimization.
        </para>
        """
        story.append(Paragraph(summary_text, self.highlight_box))
        
        story.append(PageBreak())
        
        # Financial Overview
        story.append(Paragraph("Financial Overview", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        # Summary cards in a table
        net_worth = financial_data.get('net_worth', 215000)
        total_assets = financial_data.get('total_assets', 250000)
        total_liabilities = financial_data.get('total_liabilities', 35000)
        
        summary_data = [
            ['Net Worth', 'Total Assets', 'Total Liabilities'],
            [f"£{net_worth:,.2f}", f"£{total_assets:,.2f}", f"£{total_liabilities:,.2f}"],
            ['Your total wealth', 'All your assets', 'All your debts']
        ]
        
        summary_table = Table(summary_data, colWidths=[2.5*inch, 2.5*inch, 2.5*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, 1), 18),
            ('FONTNAME', (0, 2), (-1, 2), 'Helvetica'),
            ('FONTSIZE', (0, 2), (-1, 2), 9),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.secondary_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, self.primary_color),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(summary_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Asset Breakdown
        story.append(Paragraph("Asset Allocation", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        assets = financial_data.get('assets', {
            'Cash & Savings': 50000,
            'Investments': 150000,
            'Property': 50000
        })
        
        # Asset allocation table
        asset_data = [['Asset Type', 'Value', 'Percentage']]
        total_asset_value = sum(assets.values())
        
        for asset_type, value in assets.items():
            percentage = (value / total_asset_value) * 100 if total_asset_value > 0 else 0
            asset_data.append([asset_type, f"£{value:,.2f}", f"{percentage:.1f}%"])
        
        asset_data.append(['Total', f"£{total_asset_value:,.2f}", "100.0%"])
        
        asset_table = Table(asset_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
        asset_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.accent_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e2e8f0')),
            ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(asset_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Financial Health Score
        story.append(Paragraph("Financial Health Analysis", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        health_score = financial_data.get('health_score', 750)
        health_status = "Excellent" if health_score >= 800 else "Good" if health_score >= 600 else "Fair" if health_score >= 400 else "Needs Improvement"
        
        health_text = f"""
        <para>
        <b>Financial Health Score: {health_score}/1000 ({health_status})</b><br/><br/>
        Your financial health score indicates <b>{health_status.lower()}</b> financial management. 
        This score is calculated based on your asset diversification, debt-to-income ratio, 
        emergency fund coverage, and overall financial stability.
        </para>
        """
        story.append(Paragraph(health_text, self.body_text))
        story.append(Spacer(1, 0.3*inch))
        
        # Recommendations
        story.append(Paragraph("Strategic Recommendations", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        recommendations = [
            "Consider increasing your emergency fund to 6 months of expenses",
            "Diversify your investment portfolio across different asset classes",
            "Review and optimize your pension contributions for tax efficiency",
            "Consider additional property investments for portfolio balance",
            "Schedule quarterly reviews to track progress toward financial goals"
        ]
        
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"{i}. {rec}", self.body_text))
            story.append(Spacer(1, 0.1*inch))
        
        story.append(PageBreak())
        
        # Future Projections
        story.append(Paragraph("Wealth Projections", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        projection_text = """
        <para>
        Based on your current savings rate and investment returns, here are projected wealth scenarios:
        </para>
        """
        story.append(Paragraph(projection_text, self.body_text))
        story.append(Spacer(1, 0.2*inch))
        
        # Projection table
        projection_data = [
            ['Time Period', 'Conservative (4%)', 'Moderate (6%)', 'Aggressive (8%)'],
            ['5 Years', f"£{net_worth * 1.22:.0f}", f"£{net_worth * 1.34:.0f}", f"£{net_worth * 1.47:.0f}"],
            ['10 Years', f"£{net_worth * 1.48:.0f}", f"£{net_worth * 1.79:.0f}", f"£{net_worth * 2.16:.0f}"],
            ['15 Years', f"£{net_worth * 1.80:.0f}", f"£{net_worth * 2.40:.0f}", f"£{net_worth * 3.17:.0f}"],
            ['20 Years', f"£{net_worth * 2.19:.0f}", f"£{net_worth * 3.21:.0f}", f"£{net_worth * 4.66:.0f}"],
        ]
        
        projection_table = Table(projection_data, colWidths=[1.5*inch, 1.8*inch, 1.8*inch, 1.8*inch])
        projection_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.success_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0fdf4')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#16a34a')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(projection_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Disclaimer
        disclaimer = """
        <para>
        <b>Important Notice:</b> This report is for informational purposes only and should not be 
        considered as financial advice. All projections are based on assumptions and past performance 
        does not guarantee future results. Please consult with a qualified financial advisor before 
        making investment decisions.
        </para>
        """
        story.append(Paragraph(disclaimer, self.highlight_box))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        buffer.seek(0)
        return buffer.read()
        
    def generate_estate_planning_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate comprehensive estate planning report"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=80,
            bottomMargin=80
        )
        
        story = []
        
        # Title Page
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("Estate Planning Report", self.custom_title))
        story.append(Spacer(1, 0.5*inch))
        
        # Client info
        client_info = f"""
        <para align=center>
        <b>Prepared for:</b> {user_data.get('name', 'Valued Client')}<br/>
        <b>Report Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
        <b>Confidential Document</b>
        </para>
        """
        story.append(Paragraph(client_info, self.body_text))
        story.append(Spacer(1, 0.5*inch))
        
        # Purpose statement
        purpose_text = """
        <para align=center>
        <b>ESTATE PLANNING OVERVIEW</b><br/>
        This comprehensive report provides essential information for estate planning purposes,
        including asset documentation, tax implications, and strategic recommendations to
        protect and transfer your wealth efficiently.
        </para>
        """
        story.append(Paragraph(purpose_text, self.highlight_box))
        
        story.append(PageBreak())
        
        # Estate Summary
        story.append(Paragraph("Estate Summary", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        net_worth = financial_data.get('net_worth', 215000)
        iht_threshold = 325000  # UK Inheritance Tax threshold
        
        # Estate value summary
        estate_data = [
            ['Estate Component', 'Value', 'Notes'],
            ['Gross Estate Value', f"£{net_worth:,.2f}", 'Total assets before debts'],
            ['Less: Debts & Liabilities', f"£{financial_data.get('total_liabilities', 35000):,.2f}", 'Outstanding debts'],
            ['Net Estate Value', f"£{net_worth:,.2f}", 'Value for IHT purposes'],
            ['IHT Threshold (2025)', f"£{iht_threshold:,.2f}", 'Tax-free allowance'],
            ['Potential IHT Liability', f"£{max(0, (net_worth - iht_threshold) * 0.40):,.2f}", '40% on excess above threshold']
        ]
        
        estate_table = Table(estate_data, colWidths=[2.5*inch, 2*inch, 2.5*inch])
        estate_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),  # Net Estate Value
            ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),  # IHT Liability
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(estate_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Asset Inventory
        story.append(Paragraph("Detailed Asset Inventory", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        assets = financial_data.get('assets', {
            'Cash & Savings': 50000,
            'Investments': 150000,
            'Property': 50000
        })
        
        # Detailed asset breakdown
        asset_inventory = [['Asset Category', 'Description', 'Value', 'Ownership']]
        
        for category, value in assets.items():
            if category == 'Cash & Savings':
                asset_inventory.append([category, 'Bank accounts, savings accounts', f"£{value:,.2f}", 'Sole'])
            elif category == 'Investments':
                asset_inventory.append([category, 'Stocks, bonds, ISAs, pensions', f"£{value:,.2f}", 'Sole'])
            elif category == 'Property':
                asset_inventory.append([category, 'Primary residence, rental properties', f"£{value:,.2f}", 'Sole/Joint'])
        
        asset_inventory_table = Table(asset_inventory, colWidths=[1.8*inch, 2.5*inch, 1.5*inch, 1.2*inch])
        asset_inventory_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.accent_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(asset_inventory_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Estate Planning Recommendations
        story.append(Paragraph("Estate Planning Recommendations", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        if net_worth < iht_threshold:
            tax_status = "Your estate is currently below the inheritance tax threshold."
        else:
            tax_status = f"Your estate may be subject to inheritance tax of approximately £{(net_worth - iht_threshold) * 0.40:,.2f}."
        
        story.append(Paragraph(tax_status, self.body_text))
        story.append(Spacer(1, 0.2*inch))
        
        recommendations = [
            "Ensure your will is up-to-date and properly executed",
            "Consider establishing a trust structure for tax efficiency",
            "Review beneficiary designations on all accounts",
            "Investigate annual gift allowances to reduce estate value",
            "Consider life insurance to cover potential tax liabilities",
            "Establish lasting power of attorney for financial matters",
            "Create a comprehensive digital asset inventory",
            "Schedule regular estate planning reviews with a solicitor"
        ]
        
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"<b>{i}.</b> {rec}", self.body_text))
            story.append(Spacer(1, 0.1*inch))
        
        story.append(PageBreak())
        
        # Important Contacts
        story.append(Paragraph("Important Contacts & Documents", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        contact_info = """
        <para>
        <b>Essential Information for Executors:</b><br/><br/>
        Please ensure the following contacts and document locations are known to your executors:
        </para>
        """
        story.append(Paragraph(contact_info, self.body_text))
        story.append(Spacer(1, 0.2*inch))
        
        # Contact form
        contact_data = [
            ['Professional', 'Name', 'Phone', 'Email'],
            ['Solicitor', '_' * 20, '_' * 15, '_' * 25],
            ['Financial Advisor', '_' * 20, '_' * 15, '_' * 25],
            ['Accountant', '_' * 20, '_' * 15, '_' * 25],
            ['Bank Manager', '_' * 20, '_' * 15, '_' * 25],
            ['Insurance Agent', '_' * 20, '_' * 15, '_' * 25],
        ]
        
        contact_table = Table(contact_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
        contact_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(contact_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Document locations
        doc_locations = [
            ['Document Type', 'Location', 'Last Updated'],
            ['Will', '_' * 40, '_' * 15],
            ['Power of Attorney', '_' * 40, '_' * 15],
            ['Life Insurance Policies', '_' * 40, '_' * 15],
            ['Pension Documents', '_' * 40, '_' * 15],
            ['Property Deeds', '_' * 40, '_' * 15],
            ['Digital Asset Passwords', '_' * 40, '_' * 15],
        ]
        
        doc_table = Table(doc_locations, colWidths=[2*inch, 3*inch, 1.5*inch])
        doc_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.accent_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(doc_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Confidentiality notice
        confidentiality = """
        <para align=center>
        <b>CONFIDENTIALITY NOTICE</b><br/>
        This document contains sensitive financial information and should be stored securely.
        It is designed to assist solicitors, will writers, and designated beneficiaries in
        understanding the complete asset structure in the event of incapacity or death.
        Please update this report regularly as asset values and holdings change.
        </para>
        """
        story.append(Paragraph(confidentiality, self.highlight_box))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        buffer.seek(0)
        return buffer.read()
        
    def generate_financial_health_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate comprehensive financial health report"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=80,
            bottomMargin=80
        )
        
        story = []
        
        # Title Page
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("Financial Health Check Report", self.custom_title))
        story.append(Spacer(1, 0.5*inch))
        
        # Client info
        client_info = f"""
        <para align=center>
        <b>Prepared for:</b> {user_data.get('name', 'Valued Client')}<br/>
        <b>Report Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
        <b>Health Check Analysis</b>
        </para>
        """
        story.append(Paragraph(client_info, self.body_text))
        story.append(Spacer(1, 0.5*inch))
        
        # Executive summary
        executive_summary = """
        <para align=center>
        <b>FINANCIAL HEALTH ASSESSMENT</b><br/>
        This comprehensive analysis evaluates your current financial position across multiple
        dimensions including income management, expense control, savings rate, debt management,
        and investment strategy to provide actionable insights for financial improvement.
        </para>
        """
        story.append(Paragraph(executive_summary, self.highlight_box))
        
        story.append(PageBreak())
        
        # Overall Score
        story.append(Paragraph("Overall Financial Health Score", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        health_score = financial_data.get('health_score', 750)
        max_score = 1000
        
        # Score visualization
        score_data = [
            ['Current Score', 'Rating', 'Status'],
            [f"{health_score}/{max_score}", self._get_health_rating(health_score), self._get_health_status(health_score)]
        ]
        
        score_table = Table(score_data, colWidths=[2*inch, 2*inch, 3*inch])
        score_color = self._get_score_color(health_score)
        
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), score_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, 1), 20),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, score_color),
            ('TOPPADDING', (0, 0), (-1, -1), 15),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ]))
        
        story.append(score_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Detailed Scores
        story.append(Paragraph("Detailed Health Metrics", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        # Sample detailed scores
        detailed_scores = [
            ['Financial Category', 'Score', 'Rating', 'Target'],
            ['Income Management', '8.5/10', 'Excellent', 'Maintain current level'],
            ['Expense Control', '7.2/10', 'Good', 'Reduce non-essential spending'],
            ['Savings Rate', '6.8/10', 'Good', 'Increase to 20% of income'],
            ['Debt Management', '9.1/10', 'Excellent', 'Continue current strategy'],
            ['Investment Strategy', '7.5/10', 'Good', 'Diversify portfolio'],
            ['Emergency Fund', '5.5/10', 'Fair', 'Build to 6 months expenses'],
            ['Insurance Coverage', '8.0/10', 'Good', 'Review life insurance needs'],
            ['Retirement Planning', '7.8/10', 'Good', 'Increase pension contributions']
        ]
        
        detailed_table = Table(detailed_scores, colWidths=[2*inch, 1.2*inch, 1.3*inch, 2.5*inch])
        detailed_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.accent_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(detailed_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Current Financial Position
        story.append(Paragraph("Current Financial Position", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        monthly_income = financial_data.get('monthly_income', 8500)
        monthly_expenses = financial_data.get('monthly_expenses', 6200)
        monthly_surplus = monthly_income - monthly_expenses
        
        position_data = [
            ['Financial Metric', 'Current Value', 'Industry Average', 'Assessment'],
            ['Monthly Income', f"£{monthly_income:,.2f}", 'N/A', 'Strong income base'],
            ['Monthly Expenses', f"£{monthly_expenses:,.2f}", f"£{monthly_income * 0.75:,.2f}", 'Within healthy range'],
            ['Monthly Surplus', f"£{monthly_surplus:,.2f}", f"£{monthly_income * 0.15:,.2f}", 'Excellent savings rate'],
            ['Savings Rate', f"{(monthly_surplus/monthly_income)*100:.1f}%", '15%', 'Above average'],
            ['Debt-to-Income Ratio', '12%', '20%', 'Low debt burden'],
        ]
        
        position_table = Table(position_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 2*inch])
        position_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(position_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Action Plan
        story.append(Paragraph("Personalized Action Plan", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        action_plan = [
            ("Short-term (1-3 months)", [
                "Build emergency fund to £12,000 (2 months expenses)",
                "Review and cancel unnecessary subscriptions",
                "Set up automatic savings transfers",
                "Review current insurance coverage"
            ]),
            ("Medium-term (3-12 months)", [
                "Increase emergency fund to £37,200 (6 months expenses)",
                "Maximize annual ISA contributions",
                "Diversify investment portfolio",
                "Consider additional pension contributions"
            ]),
            ("Long-term (1+ years)", [
                "Achieve 25% savings rate target",
                "Build investment portfolio to £300,000",
                "Consider property investment opportunities",
                "Plan for early retirement options"
            ])
        ]
        
        for timeframe, actions in action_plan:
            story.append(Paragraph(timeframe, self.subsection_header))
            for action in actions:
                story.append(Paragraph(f"• {action}", self.body_text))
                story.append(Spacer(1, 0.1*inch))
            story.append(Spacer(1, 0.2*inch))
        
        story.append(PageBreak())
        
        # Progress Tracking
        story.append(Paragraph("Progress Tracking Framework", self.section_header))
        story.append(Spacer(1, 0.2*inch))
        
        tracking_text = """
        <para>
        <b>Quarterly Review Schedule:</b><br/>
        To maintain and improve your financial health, we recommend quarterly reviews focusing on:
        </para>
        """
        story.append(Paragraph(tracking_text, self.body_text))
        story.append(Spacer(1, 0.2*inch))
        
        # Progress tracking table
        tracking_data = [
            ['Review Area', 'Frequency', 'Key Metrics', 'Target'],
            ['Income & Expenses', 'Monthly', 'Surplus amount, savings rate', 'Maintain 20%+ savings'],
            ['Investment Performance', 'Quarterly', 'Portfolio value, returns', '6-8% annual growth'],
            ['Debt Management', 'Quarterly', 'Debt balances, payments', 'Reduce by 5% annually'],
            ['Emergency Fund', 'Quarterly', 'Fund balance vs. expenses', '6 months coverage'],
            ['Insurance Coverage', 'Annually', 'Coverage amounts, premiums', 'Adequate protection'],
            ['Retirement Planning', 'Annually', 'Pension value, contributions', '15% of income minimum']
        ]
        
        tracking_table = Table(tracking_data, colWidths=[1.5*inch, 1.2*inch, 2*inch, 2.3*inch])
        tracking_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.success_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0fdf4')),
            ('TEXTCOLOR', (0, 1), (-1, -1), self.text_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#16a34a')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(tracking_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Final recommendations
        final_recommendations = """
        <para>
        <b>Key Takeaways:</b><br/>
        Your financial health score of {health_score}/1000 indicates {status} financial management. 
        Focus on building your emergency fund, maintaining your excellent savings rate, and 
        diversifying your investment portfolio. Regular monitoring and adjustments will help 
        you achieve your long-term financial goals.
        </para>
        """.format(health_score=health_score, status=self._get_health_status(health_score).lower())
        
        story.append(Paragraph(final_recommendations, self.highlight_box))
        
        # Build PDF
        doc.build(story, onFirstPage=self._create_header_footer, onLaterPages=self._create_header_footer)
        buffer.seek(0)
        return buffer.read()
        
    def _get_health_rating(self, score: int) -> str:
        """Get health rating based on score"""
        if score >= 800:
            return "Excellent"
        elif score >= 600:
            return "Good"
        elif score >= 400:
            return "Fair"
        else:
            return "Needs Improvement"
            
    def _get_health_status(self, score: int) -> str:
        """Get health status description"""
        if score >= 800:
            return "Outstanding financial management with strong fundamentals"
        elif score >= 600:
            return "Solid financial position with room for optimization"
        elif score >= 400:
            return "Adequate financial health with areas for improvement"
        else:
            return "Financial health requires immediate attention"
            
    def _get_score_color(self, score: int):
        """Get color based on score"""
        if score >= 800:
            return self.success_color
        elif score >= 600:
            return colors.HexColor('#f59e0b')  # Orange
        elif score >= 400:
            return colors.HexColor('#ef4444')  # Red
        else:
            return colors.HexColor('#7c2d12')  # Dark red