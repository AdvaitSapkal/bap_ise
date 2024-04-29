from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

df = pd.read_csv('./bap_ise_data.csv')

@app.route('/query/<column>/<value>')
def query_csv(column, value):
    filtered_df = df[df[column] == value]
    result = filtered_df.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)