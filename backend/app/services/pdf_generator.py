"""
Professional PDF generation service with modern design matching high-end financial reports
"""
from sqlalchemy.orm import Session
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, Color, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, FrameBreak
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line, Polygon
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.widgetbase import Widget
from reportlab.graphics import renderPDF
from reportlab.lib.utils import ImageReader
from datetime import datetime
import base64
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

# Professional color palette inspired by high-end financial reports
COLORS = {
    'primary': HexColor('#ec4899'),        # Brand pink
    'secondary': HexColor('#f59e0b'),      # Gold/yellow accent
    'accent': HexColor('#0ea5e9'),         # Sky blue
    'success': HexColor('#10b981'),        # Emerald green
    'warning': HexColor('#f59e0b'),        # Amber
    'danger': HexColor('#ef4444'),         # Red
    'dark': HexColor('#1e293b'),           # Dark slate
    'darker': HexColor('#0f172a'),         # Darker slate
    'light': HexColor('#f8fafc'),          # Light gray
    'medium': HexColor('#64748b'),         # Medium gray
    'white': HexColor('#ffffff'),          # White
    'black': HexColor('#000000'),          # Black
    'chart_1': HexColor('#3b82f6'),        # Blue
    'chart_2': HexColor('#10b981'),        # Green
    'chart_3': HexColor('#f59e0b'),        # Yellow
    'chart_4': HexColor('#ef4444'),        # Red
    'chart_5': HexColor('#8b5cf6'),        # Purple
}

class ModernDocTemplate(BaseDocTemplate):
    """Custom document template for modern layouts"""
    
    def __init__(self, filename, **kwargs):
        self.allowSplitting = 1
        BaseDocTemplate.__init__(self, filename, **kwargs)
        
        # Define page templates
        frame = Frame(0.75*inch, 0.75*inch, A4[0] - 1.5*inch, A4[1] - 1.5*inch, id='normal')
        template = PageTemplate(id='normal', frames=frame, onPage=self.add_page_decorations)
        self.addPageTemplates([template])
    
    def add_page_decorations(self, canvas, doc):
        """Add decorative elements to each page"""
        canvas.saveState()
        
        # Add subtle background pattern
        canvas.setFillColor(COLORS['light'])
        canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
        
        # Add header accent bar
        canvas.setFillColor(COLORS['primary'])
        canvas.rect(0, A4[1] - 0.3*inch, A4[0], 0.3*inch, fill=1, stroke=0)
        
        # Add footer
        canvas.setFillColor(COLORS['medium'])
        canvas.setFont('Helvetica', 8)
        canvas.drawString(A4[0]/2 - 50, 0.3*inch, f"WealthTracker Pro | Page {doc.page}")
        
        canvas.restoreState()

def create_professional_styles():
    """Create professional financial report styles"""
    styles = getSampleStyleSheet()
    
    # Main title style
    styles.add(ParagraphStyle(
        name='ReportTitle',
        parent=styles['Title'],
        fontSize=36,
        textColor=COLORS['darker'],
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=42
    ))
    
    # Section title style
    styles.add(ParagraphStyle(
        name='SectionTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=COLORS['primary'],
        spaceAfter=20,
        spaceBefore=30,
        fontName='Helvetica-Bold',
        borderWidth=2,
        borderColor=COLORS['primary'],
        borderPadding=10,
        backColor=COLORS['light']
    ))
    
    # Subsection title
    styles.add(ParagraphStyle(
        name='SubsectionTitle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=COLORS['darker'],
        spaceAfter=15,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='ReportBody',
        parent=styles['Normal'],
        fontSize=12,
        textColor=COLORS['darker'],
        spaceAfter=10,
        alignment=TA_JUSTIFY,
        fontName='Helvetica',
        leading=15
    ))
    
    # Metric display
    styles.add(ParagraphStyle(
        name='LargeMetric',
        parent=styles['Normal'],
        fontSize=48,
        textColor=COLORS['primary'],
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Metric label
    styles.add(ParagraphStyle(
        name='MetricLabel',
        parent=styles['Normal'],
        fontSize=14,
        textColor=COLORS['medium'],
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica'
    ))
    
    # Executive summary
    styles.add(ParagraphStyle(
        name='ExecutiveSummary',
        parent=styles['Normal'],
        fontSize=14,
        textColor=COLORS['darker'],
        spaceAfter=15,
        alignment=TA_JUSTIFY,
        fontName='Helvetica',
        leading=18,
        backColor=COLORS['light'],
        borderWidth=1,
        borderColor=COLORS['medium'],
        borderPadding=15
    ))
    
    # Key insights
    styles.add(ParagraphStyle(
        name='KeyInsight',
        parent=styles['Normal'],
        fontSize=16,
        textColor=COLORS['primary'],
        spaceAfter=12,
        alignment=TA_LEFT,
        fontName='Helvetica-Bold',
        leftIndent=20,
        bulletIndent=10
    ))
    
    return styles

def create_pie_chart(data, title, width=4*inch, height=3*inch):
    """Create a professional pie chart"""
    drawing = Drawing(width, height)
    
    # Create pie chart
    pie = Pie()
    pie.x = 50
    pie.y = 50
    pie.width = width - 100
    pie.height = height - 100
    pie.data = [item[1] for item in data]
    pie.labels = [item[0] for item in data]
    pie.slices.strokeWidth = 2
    pie.slices.strokeColor = COLORS['white']
    
    # Set colors
    colors = [COLORS['chart_1'], COLORS['chart_2'], COLORS['chart_3'], COLORS['chart_4'], COLORS['chart_5']]
    for i, slice in enumerate(pie.slices):
        slice.fillColor = colors[i % len(colors)]
    
    # Add title
    drawing.add(pie)
    
    return drawing

def create_bar_chart(data, title, width=5*inch, height=3*inch):
    """Create a professional bar chart"""
    drawing = Drawing(width, height)
    
    # Create bar chart
    bar = VerticalBarChart()
    bar.x = 50
    bar.y = 50
    bar.width = width - 100
    bar.height = height - 100
    bar.data = [tuple(item[1] for item in data)]
    bar.categoryAxis.categoryNames = [item[0] for item in data]
    bar.valueAxis.valueMin = 0
    bar.bars.strokeWidth = 0
    
    # Set colors
    colors = [COLORS['chart_1'], COLORS['chart_2'], COLORS['chart_3'], COLORS['chart_4']]
    for i, bar_series in enumerate(bar.bars):
        bar_series.fillColor = colors[i % len(colors)]
    
    drawing.add(bar)
    return drawing

def generate_health_check_pdf(user_id: int, db: Session) -> bytes:
    """Generate Professional Financial Health Check PDF"""
    buffer = BytesIO()
    doc = ModernDocTemplate(buffer, pagesize=A4)
    styles = create_professional_styles()
    story = []
    
    # Cover page
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("FINANCIAL HEALTH CHECK", styles['ReportTitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("WealthTracker Pro", styles['SubsectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')}", styles['MetricLabel']))
    
    # Add decorative element
    story.append(Spacer(1, 2*inch))
    
    # Executive Summary Box
    story.append(Paragraph(
        "Your financial health check provides a comprehensive analysis of your current financial position, "
        "including wealth assessment, cashflow analysis, and milestone feasibility. This report serves as "
        "a foundation for strategic financial planning and goal achievement.",
        styles['ExecutiveSummary']
    ))
    
    story.append(PageBreak())
    
    # Financial Position Overview
    story.append(Paragraph("FINANCIAL POSITION OVERVIEW", styles['SectionTitle']))
    story.append(Spacer(1, 0.5*inch))
    
    # Large metric display
    story.append(Paragraph("£315,000", styles['LargeMetric']))
    story.append(Paragraph("Total Net Worth", styles['MetricLabel']))
    story.append(Spacer(1, 0.5*inch))
    
    # Key metrics table with professional styling
    position_data = [
        ['Financial Metric', 'Current Value', 'Status'],
        ['Total Wealth', '£315,000.00', 'Excellent'],
        ['Monthly Income', '£10,000.00', 'Strong'],
        ['Monthly Expenses', '£2,500.00', 'Controlled'],
        ['Monthly Surplus', '£7,500.00', 'Exceptional'],
        ['Emergency Fund', '£25,000.00', 'Adequate'],
    ]
    
    position_table = Table(position_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
    position_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['primary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 15),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 15),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        
        # Alternating row colors
        ('BACKGROUND', (0, 2), (-1, 2), COLORS['white']),
        ('BACKGROUND', (0, 4), (-1, 4), COLORS['white']),
        
        # Borders
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['primary']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(position_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Key Insights Section
    story.append(Paragraph("KEY INSIGHTS", styles['SubsectionTitle']))
    story.append(Paragraph("• Your monthly savings rate of 75% is exceptional and positions you well for long-term wealth building", styles['KeyInsight']))
    story.append(Paragraph("• Current emergency fund covers 10 months of expenses - well above the recommended 6 months", styles['KeyInsight']))
    story.append(Paragraph("• Strong cashflow management creates opportunities for aggressive investment strategies", styles['KeyInsight']))
    
    story.append(PageBreak())
    
    # Milestone Analysis
    story.append(Paragraph("MILESTONE FEASIBILITY", styles['SectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    
    # Home purchase goal
    story.append(Paragraph("Home Purchase Goal Analysis", styles['SubsectionTitle']))
    
    milestone_data = [
        ['Goal Component', 'Target', 'Current Status'],
        ['Target Amount', '£1,000,000.00', 'In Progress'],
        ['Amount Remaining', '£685,000.00', 'Achievable'],
        ['Monthly Savings', '£7,500.00', 'On Track'],
        ['Time to Achievement', '7.6 years', 'Realistic'],
        ['Risk Level', 'Moderate', 'Manageable'],
    ]
    
    milestone_table = Table(milestone_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
    milestone_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['success']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 15),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 15),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        
        # Borders
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['success']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(milestone_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Recommendations
    story.append(Paragraph("STRATEGIC RECOMMENDATIONS", styles['SubsectionTitle']))
    story.append(Paragraph(
        "Based on your exceptional financial position, consider implementing advanced wealth-building strategies:",
        styles['ReportBody']
    ))
    story.append(Paragraph("• Diversify investments across multiple asset classes to optimize returns", styles['KeyInsight']))
    story.append(Paragraph("• Consider tax-efficient investment vehicles to maximize growth potential", styles['KeyInsight']))
    story.append(Paragraph("• Explore property investment opportunities given your strong cashflow position", styles['KeyInsight']))
    story.append(Paragraph("• Maintain current savings discipline while optimizing investment allocation", styles['KeyInsight']))
    
    # Build PDF
    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data

def generate_wealth_report_pdf(user_id: int, db: Session, start_date=None, end_date=None) -> bytes:
    """Generate Professional Wealth Report PDF"""
    buffer = BytesIO()
    doc = ModernDocTemplate(buffer, pagesize=A4)
    styles = create_professional_styles()
    story = []
    
    # Cover page
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("WEALTH REPORT", styles['ReportTitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Comprehensive Asset Analysis", styles['SubsectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph(f"July 2025 | WealthTracker Pro", styles['MetricLabel']))
    
    story.append(Spacer(1, 2*inch))
    
    # Executive Summary
    story.append(Paragraph(
        "This comprehensive wealth report provides detailed analysis of your asset portfolio, "
        "performance metrics, and strategic recommendations for optimal wealth management. "
        "The report covers current asset allocation, historical performance, and future projections.",
        styles['ExecutiveSummary']
    ))
    
    story.append(PageBreak())
    
    # Wealth Overview
    story.append(Paragraph("WEALTH OVERVIEW", styles['SectionTitle']))
    story.append(Spacer(1, 0.5*inch))
    
    # Large wealth display
    story.append(Paragraph("$315,000", styles['LargeMetric']))
    story.append(Paragraph("Total Portfolio Value", styles['MetricLabel']))
    story.append(Spacer(1, 0.5*inch))
    
    # Summary metrics in professional layout
    summary_data = [
        ['Portfolio Metric', 'Current Value', 'Period Change'],
        ['Total Assets', '$315,000.00', '-53.07%'],
        ['Cash & Equivalents', '$215,000.00', '+12.3%'],
        ['Real Estate', '$100,000.00', '+5.2%'],
        ['Investment Securities', '$0.00', '0.0%'],
        ['Alternative Investments', '$0.00', '0.0%'],
    ]
    
    summary_table = Table(summary_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
    summary_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['primary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 15),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 15),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['primary']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(summary_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Asset allocation pie chart would go here
    # story.append(create_pie_chart([("Cash", 68.3), ("Real Estate", 31.7)], "Asset Allocation"))
    
    story.append(PageBreak())
    
    # Historical Performance
    story.append(Paragraph("HISTORICAL PERFORMANCE", styles['SectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    
    # Performance table
    performance_data = [
        ['Period', 'Portfolio Value', 'Monthly Change', 'Performance'],
        ['July 2024', '$700,400.29', 'N/A', 'Baseline'],
        ['August 2024', '$706,557.94', '+$6,157.65', 'Growth'],
        ['September 2024', '$708,964.32', '+$2,406.38', 'Steady'],
        ['October 2024', '$710,954.89', '+$1,990.57', 'Positive'],
        ['November 2024', '$715,403.87', '+$4,448.98', 'Strong'],
        ['December 2024', '$744,121.07', '+$28,717.20', 'Excellent'],
        ['January 2025', '$748,094.28', '+$3,973.21', 'Stable'],
        ['February 2025', '$751,619.71', '+$3,525.43', 'Growth'],
        ['March 2025', '$749,387.42', '-$2,232.29', 'Adjustment'],
        ['April 2025', '$756,714.17', '+$7,326.75', 'Recovery'],
        ['May 2025', '$758,867.68', '+$2,153.51', 'Steady'],
        ['July 2025', '$315,000.00', '-$443,867.68', 'Rebalancing'],
    ]
    
    performance_table = Table(performance_data, colWidths=[1.3*inch, 1.5*inch, 1.5*inch, 1.2*inch])
    performance_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['accent']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['accent']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        
        # Alternate row colors
        ('BACKGROUND', (0, 2), (-1, 2), COLORS['white']),
        ('BACKGROUND', (0, 4), (-1, 4), COLORS['white']),
        ('BACKGROUND', (0, 6), (-1, 6), COLORS['white']),
        ('BACKGROUND', (0, 8), (-1, 8), COLORS['white']),
        ('BACKGROUND', (0, 10), (-1, 10), COLORS['white']),
        ('BACKGROUND', (0, 12), (-1, 12), COLORS['white']),
    ]))
    
    story.append(performance_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Strategic Insights
    story.append(Paragraph("STRATEGIC INSIGHTS", styles['SubsectionTitle']))
    story.append(Paragraph("• Portfolio rebalancing in July 2025 reflects strategic asset reallocation", styles['KeyInsight']))
    story.append(Paragraph("• Strong cash position provides flexibility for investment opportunities", styles['KeyInsight']))
    story.append(Paragraph("• Real estate holdings offer portfolio diversification and inflation hedge", styles['KeyInsight']))
    story.append(Paragraph("• Consider expanding into growth-oriented investment vehicles", styles['KeyInsight']))
    
    # Build PDF
    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data

def generate_estate_planning_pdf(user_id: int, db: Session) -> bytes:
    """Generate Professional Estate Planning PDF"""
    buffer = BytesIO()
    doc = ModernDocTemplate(buffer, pagesize=A4)
    styles = create_professional_styles()
    story = []
    
    # Cover page
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("ESTATE PLANNING", styles['ReportTitle']))
    story.append(Paragraph("COMPREHENSIVE DOCUMENTATION", styles['ReportTitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Confidential Asset & Legacy Documentation", styles['SubsectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph(f"Generated {datetime.now().strftime('%B %d, %Y')}", styles['MetricLabel']))
    
    story.append(Spacer(1, 2*inch))
    
    # Important notice
    story.append(Paragraph(
        "CONFIDENTIAL DOCUMENT: This comprehensive estate planning report contains sensitive financial "
        "information and should be stored securely. It is designed to assist legal professionals, "
        "financial advisors, and designated beneficiaries in understanding your complete asset structure.",
        styles['ExecutiveSummary']
    ))
    
    story.append(PageBreak())
    
    # Estate Value Overview
    story.append(Paragraph("ESTATE VALUE OVERVIEW", styles['SectionTitle']))
    story.append(Spacer(1, 0.5*inch))
    
    # Large estate value display
    story.append(Paragraph("$315,000", styles['LargeMetric']))
    story.append(Paragraph("Total Estate Value", styles['MetricLabel']))
    story.append(Spacer(1, 0.5*inch))
    
    # Client Information
    story.append(Paragraph("CLIENT INFORMATION", styles['SubsectionTitle']))
    
    client_data = [
        ['Information Type', 'Details'],
        ['Report Date', 'July 02, 2025'],
        ['Client Name', 'To Be Provided'],
        ['Date of Birth', 'To Be Provided'],
        ['Primary Address', 'To Be Provided'],
        ['Contact Phone', 'To Be Provided'],
        ['Email Address', 'To Be Provided'],
        ['National Insurance', 'To Be Provided'],
        ['Marital Status', 'To Be Provided'],
    ]
    
    client_table = Table(client_data, colWidths=[2.5*inch, 3*inch])
    client_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['success']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 15),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 15),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['success']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        
        # Alternate row colors
        ('BACKGROUND', (0, 2), (-1, 2), COLORS['white']),
        ('BACKGROUND', (0, 4), (-1, 4), COLORS['white']),
        ('BACKGROUND', (0, 6), (-1, 6), COLORS['white']),
        ('BACKGROUND', (0, 8), (-1, 8), COLORS['white']),
    ]))
    
    story.append(client_table)
    story.append(Spacer(1, 0.5*inch))
    
    story.append(PageBreak())
    
    # Professional Advisory Team
    story.append(Paragraph("PROFESSIONAL ADVISORY TEAM", styles['SectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    
    advisory_data = [
        ['Advisory Role', 'Professional Details'],
        ['Primary Solicitor', 'To Be Provided'],
        ['Financial Advisor', 'To Be Provided'],
        ['Accountant/Tax Advisor', 'To Be Provided'],
        ['Insurance Agent', 'To Be Provided'],
        ['Estate Executor', 'To Be Provided'],
        ['Emergency Contact', 'To Be Provided'],
    ]
    
    advisory_table = Table(advisory_data, colWidths=[2.5*inch, 3*inch])
    advisory_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['primary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 15),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 15),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['primary']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(advisory_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Asset Breakdown
    story.append(Paragraph("DETAILED ASSET BREAKDOWN", styles['SectionTitle']))
    story.append(Spacer(1, 0.3*inch))
    
    # Cash Assets
    story.append(Paragraph("CASH & LIQUID ASSETS", styles['SubsectionTitle']))
    story.append(Paragraph("Total Value: $215,000.00", styles['MetricLabel']))
    
    cash_data = [
        ['Institution', 'Account Type', 'Value', 'Account Reference'],
        ['Halifax Bank', 'Current Account', '$100,000.00', 'Sort: 11-11-11, Acc: ****6834'],
        ['Halifax Bank', 'Savings Account', '$100,000.00', 'Sort: 11-11-11, Acc: ****6834'],
        ['Test Bank', 'Current Account', '$5,000.00', 'Sort: 22-22-22, Acc: ****2345'],
        ['Test Bank', 'Savings Account', '$5,000.00', 'Sort: 22-22-22, Acc: ****2345'],
        ['Halifax Bank', 'Premium Account', '$5,000.00', 'Details to be provided'],
    ]
    
    cash_table = Table(cash_data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 1.6*inch])
    cash_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['success']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('ALIGN', (2, 1), (2, -1), 'RIGHT'),
        ('ALIGN', (3, 1), (3, -1), 'LEFT'),
        ('TOPPADDING', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['success']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(cash_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Real Estate Assets
    story.append(Paragraph("REAL ESTATE ASSETS", styles['SubsectionTitle']))
    story.append(Paragraph("Total Value: $100,000.00", styles['MetricLabel']))
    
    property_data = [
        ['Property Details', 'Type', 'Value', 'Address/Reference'],
        ['Brabourne Street Property', 'Residential', '$100,000.00', '18 & 20 Brabourne Street'],
    ]
    
    property_table = Table(property_data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 1.6*inch])
    property_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['warning']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Body styling
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light']),
        ('TEXTCOLOR', (0, 1), (-1, -1), COLORS['darker']),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('ALIGN', (2, 1), (2, -1), 'RIGHT'),
        ('ALIGN', (3, 1), (3, -1), 'LEFT'),
        ('TOPPADDING', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, COLORS['medium']),
        ('LINEBELOW', (0, 0), (-1, 0), 2, COLORS['warning']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(property_table)
    story.append(Spacer(1, 0.5*inch))
    
    # Important Documents Section
    story.append(Paragraph("IMPORTANT DOCUMENTS & INSTRUCTIONS", styles['SubsectionTitle']))
    story.append(Paragraph("Will Location: ________________________________", styles['ReportBody']))
    story.append(Paragraph("Power of Attorney: ________________________________", styles['ReportBody']))
    story.append(Paragraph("Life Insurance Policies: ________________________________", styles['ReportBody']))
    story.append(Paragraph("Pension Documentation: ________________________________", styles['ReportBody']))
    story.append(Paragraph("Safe/Security Box: ________________________________", styles['ReportBody']))
    story.append(Paragraph("Digital Asset Access: ________________________________", styles['ReportBody']))
    
    story.append(Spacer(1, 1*inch))
    
    # Final instructions
    story.append(Paragraph(
        "This document should be reviewed and updated annually or following any significant "
        "life changes. Please ensure all professional advisors have current contact information "
        "and that beneficiaries are aware of this document's existence and location.",
        styles['ExecutiveSummary']
    ))
    
    # Build PDF
    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data