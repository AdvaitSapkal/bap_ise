from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

df = pd.read_csv('./bap_ise_data.csv')

total_rooms=set(df['room_num'].unique())



#individual tt of faculty
@app.route('/query/<column>/<value>')
def query_csv(column, value):
    filtered_df = df[df[column] == value]
    result = filtered_df.to_dict(orient='records')
    return jsonify(result)

#room availability
@app.route('/query/availability/<start>/<end>/<day>')
def query_rooms(start, end, day):
    start_time = pd.to_datetime(start, format='%H:%M').time()
    end_time = pd.to_datetime(end, format='%H:%M').time()

    filtered_df = df[(df['day'] == day) & ((df['start_time'] == start_time) | (df['end_time'] == end_time))]

    room_numbers = set(filtered_df['room_num'])

    result_set=total_rooms-room_numbers

    return jsonify(list(result_set))

if __name__ == '__main__':
    app.run(debug=True)