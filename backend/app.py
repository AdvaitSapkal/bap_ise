from flask import Flask, jsonify, render_template
import pandas as pd
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import dash
from dash import dcc, html
import numpy as np

app = Flask(__name__)

df = pd.read_csv('./bap_ise_data.csv')

total_rooms=set(df['room_num'].unique())

dash_app = dash.Dash(__name__, server=app, url_base_pathname='/dashboard/')

# Define Plotly graph 1
trace1 = go.Scatter(x=[1, 2, 3], y=[4, 1, 2], mode='lines', name='Line Chart 1')
layout1 = go.Layout(title='Graph 1')

# Define Plotly graph 2
trace2 = go.Bar(x=[1, 2, 3], y=[4, 1, 2], name='Bar Chart 2')
layout2 = go.Layout(title='Graph 2')

# Define layout for the Dash app
dash_app.layout = html.Div(children=[
    html.H1(children='Dashboard with Dash and Flask'),
    
    # Plotly graph 1
    dcc.Graph(
        id='graph1',
        figure={
            'data': [trace1],
            'layout': layout1
        }
    ),
    
    # Plotly graph 2
    dcc.Graph(
        id='graph2',
        figure={
            'data': [trace2],
            'layout': layout2
        }
    ),
])

@app.route('/dashboard/')
def dash_app():
    return dash_app.index()



#individual tt of faculty
@app.route('/query/<column>/<value>')
def query_csv(column, value):
    filtered_df = df[df[column] == value]
    result = filtered_df.to_dict(orient='records')
    return jsonify(result)

#room availability
@app.route('/query/availability/<start>/<end>/<day>')
def query_rooms(start, end, day):
    start_time = pd.to_datetime(start, format='%H:%M').strftime('%H:%M:%S')
    end_time = pd.to_datetime(end, format='%H:%M').strftime('%H:%M:%S')

    filtered_df = df[(df['day'] == day) & ((df['start_time'] == start_time) | (df['end_time'] == end_time))]

    room_numbers = set(filtered_df['room_num'])

    result_set=total_rooms-room_numbers

    return jsonify(list(result_set))

@app.route('/dashboard_plain')
def dashboard():
    # Get the counts of occurrences for each unique value in the 'faculty_code' column
    value_counts = df['faculty_code'].value_counts()

    # Create a bar graph for 'faculty_code'
    trace1 = go.Bar(x=value_counts.index, y=value_counts.values, name='Faculty Code')

    # Get the mean age for each unique value in the 'faculty_code' column
    mean_age = df.groupby('faculty_code')['duration'].sum()

    # Create a bar graph for mean age
    trace2 = go.Bar(x=mean_age.index, y=mean_age.values, name='Mean Age')

    # Create a scatter plot of dummy values
    np.random.seed(0)
    x = np.linspace(0, 1, 100)
    y = np.random.randn(100)
    trace3 = go.Scatter(x=x, y=y, mode='markers', name='Dummy Scatter')

    # Create subplots for the dashboard
    fig = make_subplots(rows=2, cols=2,
                        subplot_titles=['Faculty Code Counts', 'Mean Age by Faculty Code', 'Dummy Scatter Plot'])

    # Add traces to subplots
    fig.add_trace(trace1, row=1, col=1)
    fig.add_trace(trace2, row=1, col=2)
    fig.add_trace(trace3, row=2, col=1)

    # Update layout
    fig.update_layout(title='Dashboard',
                      height=600,  # Adjust the height as needed
                      showlegend=True,
                      template='plotly_dark'  # You can change the template as desired
                      )

    # Convert the figure to HTML
    graph_html = fig.to_html(full_html=False)

    # Render the HTML template with the Plotly graph embedded
    return render_template('plot.html', graph_html=graph_html)


if __name__ == '__main__':
    app.run(debug=True)